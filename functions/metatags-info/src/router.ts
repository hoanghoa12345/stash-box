import { Router } from "./config/deps.ts";
import AuthController from "./controllers/AuthController.ts";
import CollectionController from "./controllers/CollectionController.ts";
import MetaTagController from "./controllers/MetaTagController.ts";
import { auth } from "./middleware/auth.ts";

const router = new Router();

router.get("/metatags-info/meta", MetaTagController.get_info);
router.post("/metatags-info/post", auth, MetaTagController.create);

router.post("/metatags-info/__sign_up_user", AuthController.signUp);
router.post("/metatags-info/__sign_in_user", AuthController.signIn);
router.get("/metatags-info/__get_user", auth, AuthController.getUser);

router.post("/metatags-info/collections", auth, CollectionController.store);
router.get(
  "/metatags-info/collections/:collection_id",
  auth,
  CollectionController.get
);
router.put("/metatags-info/collections", auth, CollectionController.update);
router.delete("/metatags-info/collections", auth, CollectionController.delete);

export default router;
