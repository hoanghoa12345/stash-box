import { Context } from "../config/deps.ts";
import { verifyJWT } from "../utils/helpers.ts";
import { response } from "../utils/response.ts";

export async function auth(ctx: Context, next: () => Promise<unknown>) {
  const authHeader = ctx.request.headers.get("x-user-authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    response(
      ctx,
      401,
      "Unauthorized",
      "Missing or invalid authorization header"
    );
    return;
  }

  const token = authHeader.substring(7);
  const payload = await verifyJWT(token);

  if (!payload) {
    response(ctx, 401, "Unauthorized", "Invalid token");
    return;
  }

  ctx.state.user = payload.user;
  await next();
}
