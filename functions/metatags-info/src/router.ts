import { Router } from "./config/deps.ts";
import MetaTagController from "./controllers/MetaTagController.ts";

const router = new Router();
router.get("/metatags-info/meta", MetaTagController.get_info);

export default router;
