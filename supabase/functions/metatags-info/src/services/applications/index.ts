import router from "../../routes/routes.ts";
import { response } from "../../utils/response.ts";
import type { Context } from "../../config/deps.ts";
import { db } from "../../core/database/index.ts";

router.get("/app", async (ctx: Context) => {
  try {
    const environment = Deno.env.get("ENVIRONMENT") || "production";
    const query = `SELECT key, value FROM sb_app_config WHERE is_public = true AND environment = $1;`;
    const params = [environment];
    const result = await db.query(query, params);
    const appInfo = result.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, unknown>);
    response(ctx, 200, "Get app info successful!", appInfo);
  } catch (error) {
    response(ctx, 500, "Internal server error", error);
    return;
  }
});

export const application = router;
