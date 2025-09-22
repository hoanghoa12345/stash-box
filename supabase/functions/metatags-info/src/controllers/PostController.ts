import { Context, RouterContext } from "../config/deps.ts";
import { PostUpdate } from "../models/Post.ts";
import PostService from "../services/PostService.ts";
import { log } from "../utils/logger.ts";
import { response } from "../utils/response.ts";
import { getPostsValidation } from "../validations/postValidation.ts";

class PostController {
  public static async index(ctx: Context) {
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
  }

  public static async show(ctx: RouterContext<string>) {
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
  }

  public static async store(ctx: Context) {
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
  }

  public static async update(ctx: RouterContext<string>) {
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
  }

  public static async replace(ctx: RouterContext<string>) {
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
      const result = await PostService.replace(post_id, updateData);

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

  public static async destroy(ctx: RouterContext<string>) {
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
  }
}

export default PostController;
