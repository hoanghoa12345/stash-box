import router from "../../routes/routes.ts";
import { response } from "../../utils/response.ts";
import type { Context } from "../../config/deps.ts";
import { auth } from "../../middleware/auth.ts";
import { logErr } from "../../utils/logger.ts";
import { CollectionService } from "./collections.ts";
import {
  collectionCreateValidation,
  collectionDeleteValidation,
  collectionUpdateValidation,
} from "./collectionValidation.ts";

router.get("/collections", auth, async (ctx: Context) => {
  const userId = ctx.state.user.id;
  const searchParams = new URLSearchParams(ctx.request.url.search);
  const offset = parseInt(searchParams.get("offset") || "-1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  try {
    const data = await CollectionService.all(userId, offset, limit);
    response(ctx, 200, "Collections retrieved successfully!", data);
  } catch (error) {
    logErr(error);
    response(ctx, 500, "Internal server error", error);
  }
});

router.post("/collections", auth, async (ctx: Context) => {
  const body = ctx.request.body;
  try {
    const jsonBody = await body.json();
    const { validatedData, error, message } =
      collectionCreateValidation(jsonBody);

    if (error || !validatedData) {
      response(ctx, 400, "", message);
      return;
    }
    const { data, error: err } = await CollectionService.store({
      ...validatedData,
      userId: ctx.state.user.id,
    });
    if (err) {
      response(ctx, 400, err);
      return;
    }
    response(ctx, 201, "Collection created successfully!", data);
  } catch (error) {
    response(ctx, 500, "Internal server error", error);
  }
});

router.get("/collections/:collection_id", auth, async (ctx: Context) => {
  const { collection_id } = ctx.params;
  if (!collection_id) {
    response(ctx, 400, "Collection Id is required");
    return;
  }
  try {
    const { data, error } = await CollectionService.show(collection_id);
    if (error) {
      response(ctx, 400, error);
      return;
    }
    response(ctx, 200, "Collection retrieved successfully!", data);
  } catch (error) {
    response(ctx, 500, "Internal server error", error);
  }
});

router.put("/collections", auth, async (ctx: Context) => {
  const body = ctx.request.body;
  try {
    const jsonBody = await body.json();
    const { validatedData, error, message } =
      collectionUpdateValidation(jsonBody);

    if (error || !validatedData) {
      response(ctx, 400, "", message);
      return;
    }
    const { data, error: err } = await CollectionService.update({
      ...validatedData,
      userId: ctx.state.user.id,
    });
    if (err) {
      response(ctx, 400, err);
      return;
    }
    response(ctx, 200, "Collection updated successfully!", data);
  } catch (error) {
    logErr(error);
    response(ctx, 500, "Internal server error", error);
  }
});

router.delete("/collections", auth, async (ctx: Context) => {
  const body = ctx.request.body;
  try {
    const jsonBody = await body.json();
    const { validatedData, error, message } =
      collectionDeleteValidation(jsonBody);
    if (error || !validatedData) {
      response(ctx, 400, "", message);
      return;
    }
    const { data, error: err } = await CollectionService.delete({
      ...validatedData,
      userId: ctx.state.user.id,
    });
    if (err) {
      response(ctx, 400, err);
      return;
    }
    response(ctx, 200, "Collection deleted successfully!", data);
  } catch (error) {
    logErr(error);
    response(ctx, 500, "Internal server error", error);
  }
});

export const collection = router;
