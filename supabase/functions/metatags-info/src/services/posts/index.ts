import router from "../../routes/routes.ts";
import { Context, RouterContext } from "../../config/deps.ts";
import { PostUpdate } from "./types.ts";
import { PostService } from "./posts.ts";
import { log } from "../../utils/logger.ts";
import { response } from "../../utils/response.ts";
import { getPostsValidation } from "./postValidation.ts";
import { auth } from "../../middleware/auth.ts";

router.get("/posts", auth, async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const searchParams = new URLSearchParams(ctx.request.url.search);
  const collectionId = searchParams.get("collection_id") || "";
  const isUnCategorized = searchParams.get("is_uncategorized") === "true";
  const filter = searchParams.get("filter") || "";
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const { validatedData, error, message } = getPostsValidation({
    collectionId,
    isUnCategorized,
    filter,
    offset,
    limit,
  });

  if (error) {
    response(ctx, 400, "", message);
    return;
  }

  const result = await PostService.all(
    userId,
    validatedData?.collectionId,
    validatedData?.isUnCategorized,
    validatedData?.filter,
    validatedData?.offset,
    validatedData?.limit
  );
  response(ctx, 200, "Posts retrieved successfully!", result);
});

router.get("/posts/:post_id", auth, async (ctx: RouterContext<string>) => {
  const { post_id } = ctx.params;
  if (!post_id) {
    response(ctx, 400, "Post Id is required");
    return;
  }

  const result = await PostService.show(post_id);
  if (result.error) {
    response(ctx, 400, result.error);
    return;
  }

  response(ctx, 200, "Post retrieved successfully!", result.data);
});

router.post("/posts", auth, async (ctx: Context) => {
  const body = ctx.request.body;
  try {
    const jsonBody = await body.json();
    const { title, content, collectionId, imageUrl, link } = jsonBody;

    if (!content) {
      response(ctx, 400, "Content is required");
      return;
    }

    const userId = ctx.state.user.id;
    const result = await PostService.store(
      title,
      content,
      collectionId,
      userId,
      imageUrl,
      link
    );

    if (result.error) {
      response(ctx, 400, result.error);
      return;
    }

    response(ctx, 201, "Post created successfully!", result.data);
  } catch (error) {
    log(error);
    response(ctx, 500, "Internal server error", error);
  }
});

router.put("/posts/:post_id", auth, async (ctx: RouterContext<string>) => {
  const body = ctx.request.body;
  try {
    const jsonBody = await body.json();
    const { post_id } = ctx.params;

    if (!post_id) {
      response(ctx, 400, "Post Id is required");
      return;
    }

    const { title, content, collectionId, imageUrl, link, type } = jsonBody;

    if (!title || !content) {
      response(ctx, 400, "Title and content are required");
      return;
    }

    const userId = ctx.state.user.id;
    const updateData: PostUpdate = {
      user_id: userId,
      title,
      content,
      collection_id: collectionId || null,
      image_url: imageUrl || null,
      link: link || null,
      type,
    };
    const result = await PostService.update(post_id, updateData);

    if (result.error) {
      response(ctx, 400, result.error);
      return;
    }

    response(ctx, 200, "Post updated successfully!", result.data);
  } catch (error) {
    log(error);
    response(ctx, 500, "Internal server error", error);
  }
});

router.put(
  "/posts/:post_id/refetch-metadata",
  auth,
  async (ctx: RouterContext<string>) => {
    try {
      const { post_id } = ctx.params;

      if (!post_id) {
        response(ctx, 400, "Post Id is required");
        return;
      }

      const userId = ctx.state.user.id;
      const post = await PostService.show(post_id);
      if (post.error) {
        response(ctx, 400, post.error);
        return;
      }
      if (post.data.user_id !== userId) {
        response(ctx, 400, "You are not authorized to update this post");
        return;
      }
      const result = await PostService.refetchMetadata(post_id, post.data);

      if (result.error) {
        response(ctx, 400, result.error);
        return;
      }

      response(ctx, 200, "Post updated successfully!", result.data);
    } catch (error) {
      log(error);
      response(ctx, 500, "Internal server error", error);
    }
  }
);

router.delete("/posts/:post_id", auth, async (ctx: RouterContext<string>) => {
  const { post_id } = ctx.params;
  if (!post_id) {
    response(ctx, 400, "Post Id is required");
    return;
  }

  const result = await PostService.delete(post_id);
  if (result.error) {
    response(ctx, 400, result.error);
    return;
  }

  response(ctx, 200, "Post deleted successfully!", result.data);
});

export const posts = router;
