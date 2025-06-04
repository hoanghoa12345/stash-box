import MetaTagService from "../services/MetaTagService.ts";
import { logSuccess } from "../utils/logger.ts";
import { response } from "../utils/response.ts";
import { Context } from "../config/deps.ts";

class MetaTagController {
  static async get_info(ctx: Context) {
    const urlParams = new URLSearchParams(ctx.request.url.search);
    const urlValue = urlParams.get("url");
    if (!urlValue) {
      response(ctx, 400, "URL parameter is required");
      return;
    }
    try {
      logSuccess("URL:", urlValue);
      const metaTags = await MetaTagService.getMetaTags(urlValue);
      response(ctx, 200, "Get meta tags successful!", metaTags);
    } catch (error) {
      response(ctx, 500, "Internal server error", error);
      return;
    }
  }
}

export default MetaTagController;
