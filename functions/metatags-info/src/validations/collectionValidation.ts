import { z } from "../config/deps.ts";
import { CollectionCreate, CollectionUpdate } from "../models/Collection.ts";

const CollectionCreateSchema = z.object({
  name: z.string().min(1),
  parentCollectionId: z.string().optional(),
  icon: z.string().optional(),
});

const CollectionUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  parentCollectionId: z.string().optional(),
  isRoot: z.boolean(),
  icon: z.string().optional(),
});

const CollectionDeleteSchema = z.object({
  id: z.string().min(1),
  isNested: z.boolean(),
});

export const collectionCreateValidation = (data: CollectionCreate) => {
  const result = CollectionCreateSchema.safeParse(data);
  if (!result.success) {
    return {
      error: true,
      message: result.error.format(),
    };
  }
  return {
    error: false,
    validatedData: result.data,
  };
};

export const collectionUpdateValidation = (data: CollectionUpdate) => {
  const result = CollectionUpdateSchema.safeParse(data);
  if (!result.success) {
    return {
      error: true,
      message: result.error.format(),
    };
  }
  return {
    error: false,
    validatedData: result.data,
  };
};

export const collectionDeleteValidation = (data: CollectionUpdate) => {
  const result = CollectionDeleteSchema.safeParse(data);
  if (!result.success) {
    return {
      error: true,
      message: result.error.format(),
    };
  }
  return {
    error: false,
    validatedData: result.data,
  };
};
