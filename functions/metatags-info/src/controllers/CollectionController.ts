import { Context } from "../config/deps.ts";
import CollectionService from "../services/CollectionService.ts";
import {
  collectionCreateValidation,
  collectionDeleteValidation,
  collectionUpdateValidation,
} from "../validations/collectionValidation.ts";
import { response } from "../utils/response.ts";
import { log, logErr } from "../utils/logger.ts";

class CollectionController {
  public static async store(ctx: Context) {
    const body = ctx.request.body;
    try {
      const jsonBody = await body.json();
      const { validatedData, error, message } =
        collectionCreateValidation(jsonBody);

      if (error) {
        response(ctx, 400, message);
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
  }

  public static async get(ctx: Context) {
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
  }

  public static async update(ctx: Context) {
    const body = ctx.request.body;
    try {
      const jsonBody = await body.json();
      const { validatedData, error, message } =
        collectionUpdateValidation(jsonBody);

      if (error) {
        response(ctx, 400, message);
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
  }

  public static async delete(ctx: Context) {
    const body = ctx.request.body;
    try {
      const jsonBody = await body.json();
      const { validatedData, error, message } =
        collectionDeleteValidation(jsonBody);
      if (error) {
        response(ctx, 400, message);
        return;
      }
      const { data, error: err } = await CollectionService.delete({
        ...validatedData,
        userId: ctx.state.user.id,
      });
      if (error) {
        response(ctx, 400, error);
        return;
      }
      response(ctx, 200, "Collection deleted successfully!", data);
    } catch (error) {
      logErr(error);
      response(ctx, 500, "Internal server error", error);
    }
  }
}

export default CollectionController;
