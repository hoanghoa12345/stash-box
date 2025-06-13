import { z } from "../config/deps.ts";

type GetPostData = {
  collectionId?: string;
  isUnCategorized?: boolean;
  filter?: string;
  offset?: number;
  limit?: number;
};

const GetPostsSchema = z.object({
  collectionId: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().uuid().optional()
  ),
  isUnCategorized: z.boolean().optional(),
  filter: z.string().optional(),
  offset: z.number().optional(),
  limit: z.number().optional(),
});

export const getPostsValidation = (data: GetPostData) => {
  const result = GetPostsSchema.safeParse(data);

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
