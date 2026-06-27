import { Application } from "../config/deps.ts";
import { application } from "../services/applications/index.ts";
import { collection } from "../services/collections/index.ts";
import { metatag } from "../services/metatag/index.ts";
import { posts } from "../services/posts/index.ts";

export function registerRoutes(app: Application) {
  app.use(application.routes());
  app.use(collection.routes());
  app.use(posts.routes());
  app.use(metatag.routes());
}
