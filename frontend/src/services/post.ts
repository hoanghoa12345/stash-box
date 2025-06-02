import { DataResponse, Post } from "@/types"
import axiosClient from "./axiosClient"

export const PostService = {
  getPosts: async ({
    collectionId = "",
    isUnCategorized = false,
    filter = "",
    offset = -1,
    limit = 50
  }): Promise<DataResponse<Post[]>> => {
    const response = await axiosClient.get("/posts", {
      params: {
        collection_id: collectionId,
        is_uncategorized: isUnCategorized,
        filter,
        offset,
        limit
      }
    })
    return response.data
  },
  createPost: async (postData: Post): Promise<DataResponse<Post>> => {
    const response = await axiosClient.post("/posts", postData)
    return response.data
  }
}
