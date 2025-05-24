import { createClient, SupabaseClient } from "../config/deps.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

class AuthService {
  private static supabaseClient: SupabaseClient = createClient(
    supabaseUrl,
    supabaseKey
  );

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
}

export default AuthService;
