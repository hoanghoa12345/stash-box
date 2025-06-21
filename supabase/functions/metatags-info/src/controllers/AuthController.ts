import { Context } from "../config/deps.ts";
import { logErr } from "../utils/logger.ts";
import { response } from "../utils/response.ts";
import AuthService from "../services/AuthService.ts";
import {
  signInValidation,
  signUpValidation,
} from "../validations/authValidation.ts";

class AuthController {
  public static async signUp(ctx: Context) {
    const body = ctx.request.body;
    const { email, password } = await body.json();
    const { validatedData, error, message } = signUpValidation({
      email,
      password,
    });

    if (error || !validatedData) {
      response(ctx, 400, "", message);
      return;
    }
    try {
      const { data, error } = await AuthService.signUp(
        validatedData.email,
        validatedData.password
      );
      if (error) {
        logErr(error);
        response(ctx, 400, error.message);
        return;
      }
      response(ctx, 200, "Sign up successful!", data);
    } catch (error) {
      logErr(error);
      response(ctx, 500, "Internal server error", error);
      return;
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
      response(ctx, 200, "Sign up successful!", data);
    } catch (error) {
      logErr(error);
      response(ctx, 500, "Internal server error", error);
      return;
    }
  }

  public static getUser(ctx: Context) {
    response(ctx, 200, "Get user successful!", ctx.state.user);
  }

  public static async refreshToken(ctx: Context) {
    try {
      const refreshTokenHeader = ctx.request.headers.get("x-refresh-token");
      if (!refreshTokenHeader) {
        response(ctx, 400, "Refresh token is required");
        return;
      }
      const { data, error } = await AuthService.refreshToken(
        refreshTokenHeader
      );
      if (error) {
        logErr(error);
        response(ctx, 400, error.message);
        return;
      }
      response(ctx, 200, "Refresh token successful!", data);
    } catch (error) {
      logErr(error);
      response(ctx, 500, "Internal server error", error);
      return;
    }
  }

  public static async signOut(ctx: Context) {
    try {
      const { error } = await AuthService.signOut();
      if (error) {
        logErr(error);
        response(ctx, 400, error.message);
        return;
      }
      response(ctx, 200, "Sign out successful!");
    } catch (error) {
      logErr(error);
      response(ctx, 500, "Internal server error", error);
      return;
    }
  }
}

export default AuthController;
