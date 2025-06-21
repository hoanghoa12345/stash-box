import { Context } from "../config/deps.ts";
import AuthService from "../services/AuthService.ts";
import { logErr } from "../utils/logger.ts";
import { response } from "../utils/response.ts";

export async function auth(ctx: Context, next: () => Promise<unknown>) {
  const authHeader = ctx.request.headers.get("x-user-authorization");
  if (!authHeader) {
    response(ctx, 401, "Unauthorized");
    return;
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    response(ctx, 401, "Unauthorized");
    return;
  }

  try {
    const { data, error } = await AuthService.getUser(token);
    if (error) {
      logErr(error);
      response(ctx, 401, "Unauthorized");
      return;
    }

    ctx.state.user = data.user;
    await next();
  } catch (error) {
    logErr(error);
    response(ctx, 500, error.message);
  }
}
