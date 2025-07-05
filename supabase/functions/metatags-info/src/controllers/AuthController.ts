import { Context } from "../config/deps.ts";
import { log, logErr } from "../utils/logger.ts";
import { response } from "../utils/response.ts";
import AuthService from "../services/AuthService.ts";
import { signInValidation } from "../validations/authValidation.ts";
import { createJWT, generateRandomString } from "../utils/helpers.ts";

class AuthController {
  public static async oauth(ctx: Context) {
    const rows = await AuthService.getOAuthConfig();
    const state = generateRandomString();
    await AuthService.storeOAuthState(state);
    const authConfig = rows[0].value;

    const authUrl = new URL(authConfig.authorization_endpoint);
    authUrl.searchParams.set("client_id", authConfig.client_id);
    authUrl.searchParams.set("redirect_uri", authConfig.redirect_uri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", authConfig.scope);
    authUrl.searchParams.set("state", state);

    const data = { authUrl: authUrl.toString() };
    response(ctx, 200, "Authorization URL", data);
  }

  public static async callback(ctx: Context) {
    const url = new URL(ctx.request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      response(ctx, 400, `OAuth error: ${error}`);
      return;
    }

    if (!code || !state) {
      response(ctx, 400, "Missing code or state parameter");
      return;
    }

    // Verify state
    const storedState = await AuthService.getOAuthState(state);
    if (!storedState || BigInt(Date.now()) - storedState.timestamp > 600000) {
      // 10 minutes
      response(ctx, 400, "Invalid or expired state");
      return;
    }

    await AuthService.deleteOAuthState(state);

    const rows = await AuthService.getOAuthConfig();
    const authConfig = rows[0].value;

    try {
      // Exchange code for access token
      const tokenResponse = await fetch(authConfig.token_endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: authConfig.client_id,
          client_secret: authConfig.client_secret,
          code: code,
          redirect_uri: authConfig.redirect_uri,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token exchange failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();

      // Get user info
      const userResponse = await fetch(authConfig.user_info_endpoint, {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error(`User info fetch failed: ${userResponse.status}`);
      }

      const userData = await userResponse.json();

      // Store tokens
      const expiresAt = tokenData.expires_in
        ? new Date(Date.now() + tokenData.expires_in * 1000)
        : null;

      await AuthService.storeUserTokens(
        userData.sub,
        tokenData.access_token,
        tokenData.refresh_token,
        expiresAt,
        tokenData.scope
      );

      const userIdentifier = await AuthService.getOAuthIdentity(userData.sub);
      if (!userIdentifier) {
        await AuthService.storeOAuthIdentity(userData.sub, authConfig.provider);
      }
      if (!userIdentifier.auth_user_id) {
        response(
          ctx,
          400,
          "Authorized user id not set. Please contact the admin."
        );
        return;
      }

      // Create JWT for our application
      const jwtPayload = {
        user: {
          id: userIdentifier.auth_user_id,
          email: userData.email,
          name: userData.name,
        },
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      };

      const jwt = await createJWT(jwtPayload);

      const data = {
        token: jwt,
        refreshToken: tokenData.refresh_token,
        user: {
          id: userIdentifier.auth_user_id,
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          emailVerified: userData.email_verified,
        },
      };

      response(ctx, 200, "Sign in successful", data);
    } catch (error) {
      log("OAuth callback error:", error);
      response(ctx, 500, "Internal server error", error);
    }
  }

  public static async signIn(ctx: Context) {
    const body = ctx.request.body;
    const { email, password } = await body.json();
    const { validatedData, error, message } = signInValidation({
      email,
      password,
    });

    if (error || !validatedData) {
      response(ctx, 400, "", message);
      return;
    }
    try {
      const { data, error } = await AuthService.signIn(
        validatedData.email,
        validatedData.password
      );
      if (error) {
        logErr(error);
        response(ctx, 400, error.message);
        return;
      }
      response(ctx, 200, "Sign in successful!", data);
    } catch (error) {
      logErr(error);
      response(ctx, 500, "Internal server error", error);
      return;
    }
  }

  public static getUser(ctx: Context) {
    response(ctx, 200, "Get user successful!", ctx.state.user);
  }

  public static async getProfile(ctx: Context) {
    const user = ctx.state.user;
    const userIdentifier = await AuthService.getOAuthIdentity(user.id);

    if (!userIdentifier) {
      response(ctx, 401, "User not found");
      return;
    }
    const tokens = await AuthService.getUserTokens(
      userIdentifier.oauth_user_id
    );

    if (!tokens) {
      response(ctx, 401, "User tokens not found");
      return;
    }

    try {
      const rows = await AuthService.getOAuthConfig();
      const authConfig = rows[0].value;
      // Fetch fresh user data from OAuth provider
      const userResponse = await fetch(authConfig.user_info_endpoint, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      if (!userResponse.ok) {
        response(ctx, 401, "Failed to fetch user data");
        return;
      }

      const userData = await userResponse.json();
      response(ctx, 200, "Get profile successful!", userData);
    } catch (error) {
      log("Profile fetch error:", error);
      response(ctx, 500, "Internal server error", error);
    }
  }

  public static async refreshToken(ctx: Context) {
    const body = ctx.request.body;
    const { refreshToken } = await body.json();

    if (!refreshToken) {
      response(ctx, 400, "Refresh token required");
      return;
    }

    try {
      const rows = await AuthService.getOAuthConfig();
      const authConfig = rows[0].value;
      const tokenResponse = await fetch(authConfig.token_endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: authConfig.client_id,
          client_secret: authConfig.client_secret,
          refresh_token: refreshToken,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token refresh failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();

      // Update stored tokens
      // Note: You'll need to identify which user this belongs to
      // This is a simplified example

      const data = {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
      };
      response(ctx, 200, "Token refresh successful!", data);
    } catch (error) {
      console.error("Token refresh error:", error);
      response(ctx, 500, "Token refresh failed", error);
    }
  }

  public static async signOut(ctx: Context) {
    const user = ctx.state.user;
    const userIdentifier = await AuthService.getOAuthIdentity(user.id);

    if (!userIdentifier) {
      response(ctx, 401, "User not found");
      return;
    }
    const userId = userIdentifier.oauth_user_id;

    try {
      // Get user's stored tokens
      const tokens = await AuthService.getUserTokens(userId);

      if (tokens && tokens.access_token) {
        // Try to revoke the token with the OAuth provider
        // Note: Not all OAuth providers support token revocation
        try {
          const rows = await AuthService.getOAuthConfig();
          const authConfig = rows[0].value;
          const revokeUrl = authConfig.token_endpoint.concat("/revocation");
          await fetch(revokeUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${tokens.access_token}`,
            },
            body: new URLSearchParams({
              token: tokens.access_token,
              token_type_hint: "access_token",
              client_id: authConfig.client_id,
              client_secret: authConfig.client_secret,
            }),
          });
        } catch (revokeError) {
          log(
            "Token revocation failed (provider may not support it):",
            revokeError
          );
          // Continue with local cleanup even if revocation fails
        }
      }

      // Remove tokens from server storage
      await AuthService.deleteUserTokens(userId);

      // Clean up expired OAuth states
      await AuthService.cleanupExpiredStates();

      ctx.response.body = {
        message: "Successfully signed out",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      log("Sign out error:", error);

      // Even if there's an error, clean up local tokens
      try {
        await AuthService.deleteUserTokens(userId);
      } catch (cleanupError) {
        log("Token cleanup error:", cleanupError);
      }

      ctx.response.status = 500;
      ctx.response.body = {
        error: "Sign out partially failed, but local session cleared",
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export default AuthController;
