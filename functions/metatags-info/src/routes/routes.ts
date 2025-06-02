import { Router } from "../config/deps.ts";
import AuthController from "../controllers/AuthController.ts";
import CollectionController from "../controllers/CollectionController.ts";
import MetaTagController from "../controllers/MetaTagController.ts";
import PostController from "../controllers/PostController.ts";
import { auth } from "../middleware/auth.ts";

const FUNCTION_NAME = Deno.env.get("FUNCTION_NAME") ?? "metatags-info";

const router = new Router({
  prefix: `/${FUNCTION_NAME}`,
});

router.get("/meta", MetaTagController.get_info);

router.post("/__sign_up_user", AuthController.signUp);
router.post("/sign-in", AuthController.signIn);
router.get("/user", auth, AuthController.getUser);
router.post("/sign-out", auth, AuthController.signOut);
router.post("/refresh-token", AuthController.refreshToken);

router.get("/collections", auth, CollectionController.index);
router.post("/collections", auth, CollectionController.store);
router.get("/collections/:collection_id", auth, CollectionController.get);
router.put("/collections", auth, CollectionController.update);
router.delete("/collections", auth, CollectionController.delete);

router.get("/posts", auth, PostController.index);
router.get("/posts/:post_id", auth, PostController.show);
router.post("/posts", auth, PostController.store);
router.put("/posts/:post_id", auth, PostController.update);
router.delete("/posts/:post_id", auth, PostController.destroy);

export default router;
