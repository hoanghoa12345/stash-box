import { createClient, Pool, SupabaseClient } from "../config/deps.ts";
import { IOAuthConfig, IOAuthState, IUserToken } from "../models/Auth.ts";
import Database from "../utils/database.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const databaseUrl = Deno.env.get("SUPABASE_DB_URL") ?? "";

class AuthService {
  private static supabaseClient: SupabaseClient = createClient(
    supabaseUrl,
    supabaseKey
  );

  private static pool = new Pool(databaseUrl, 3, true);
  private static db = new Database(databaseUrl);

  public static async getOAuthConfig() {
    const connection = await this.pool.connect();
    const query = `SELECT key, value FROM sb_app_config WHERE key='oauth_config';`;
    const result = await connection.queryObject<{
      key: string;
      value: IOAuthConfig;
    }>(query);
    connection.release();
    return result.rows;
  }

  static async storeOAuthState(stateKey: string, userId?: string) {
    const query = `
    INSERT INTO oauth_states (state_key, user_id, timestamp)
    VALUES ($1, $2, $3)
    ON CONFLICT (state_key) DO UPDATE SET
      user_id = EXCLUDED.user_id,
      timestamp = EXCLUDED.timestamp,
      updated_at = NOW()
  `;
    await this.db.query(query, [stateKey, userId, Date.now()]);
  }

  static async getOAuthState(stateKey: string) {
    const query = `
    SELECT user_id, timestamp, expires_at
    FROM oauth_states
    WHERE state_key = $1 AND expires_at > NOW()
  `;
    const result = await this.db.query<IOAuthState>(query, [stateKey]);
    return result.rows[0] || null;
  }

  static async deleteOAuthState(stateKey: string) {
    const query = `DELETE FROM oauth_states WHERE state_key = $1`;
    await this.db.query(query, [stateKey]);
  }

  static async storeUserTokens(
    userId: string,
    accessToken: string,
    refreshToken?: string,
    expiresAt?: Date | null,
    scope?: string
  ) {
    const query = `
    INSERT INTO user_tokens (user_id, access_token, refresh_token, expires_at, scope)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (user_id) DO UPDATE SET
      access_token = EXCLUDED.access_token,
      refresh_token = EXCLUDED.refresh_token,
      expires_at = EXCLUDED.expires_at,
      scope = EXCLUDED.scope,
      updated_at = NOW()
  `;
    await this.db.query(query, [
      userId,
      accessToken,
      refreshToken,
      expiresAt,
      scope,
    ]);
  }

  static async getUserTokens(userId: string) {
    const query = `
    SELECT access_token, refresh_token, expires_at, scope
    FROM user_tokens
    WHERE user_id = $1
  `;
    const result = await this.db.query<IUserToken>(query, [userId]);
    return result.rows[0] || null;
  }

  static async deleteUserTokens(userId: string) {
    const query = `DELETE FROM user_tokens WHERE user_id = $1`;
    await this.db.query(query, [userId]);
  }

  static async cleanupExpiredStates() {
    const query = `DELETE FROM oauth_states WHERE expires_at < NOW()`;
    await this.db.query(query);
  }

  public static getUser(token: string) {
    return this.supabaseClient.auth.getUser(token);
  }

  public static signUp(email: string, password: string) {
    return this.supabaseClient.auth.signUp({
      email,
      password,
    });
  }

  public static signIn(email: string, password: string) {
    return this.supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
  }

  public static refreshToken(refreshToken: string) {
    return this.supabaseClient.auth.refreshSession({
      refresh_token: refreshToken,
    });
  }

  public static signOut() {
    return this.supabaseClient.auth.signOut();
  }
}

export default AuthService;
