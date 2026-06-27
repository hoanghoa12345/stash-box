import { Router } from "../config/deps.ts";
import AuthController from "../controllers/AuthController.ts";
import { auth } from "../middleware/auth.ts";

const FUNCTION_NAME = Deno.env.get("FUNCTION_NAME") ?? "metatags-info";

const router = new Router({
  prefix: `/${FUNCTION_NAME}`,
});

router.get("/oauth", AuthController.oauth);
router.get("/callback", AuthController.callback);
router.post("/sign-in", AuthController.signIn);
router.get("/user", auth, AuthController.getUser);
router.get("/profile", auth, AuthController.getProfile);
router.post("/sign-out", auth, AuthController.signOut);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/link-oauth-account", AuthController.linkOAuthAccount);

export default router;
