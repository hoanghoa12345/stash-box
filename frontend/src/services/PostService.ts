import { DataResponse, Post, PostCreateData, PostUpdateData } from "@/types"
import axiosClient from "./axiosClient"

export class PostService {
  public static async getPosts({
    collectionId = "",
    isUnCategorized = false,
    filter = "",
    offset = -1,
    limit = 50
  }): Promise<DataResponse<Post[]>> {
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
  }

  public static async createPost(
    postData: PostCreateData
  ): Promise<DataResponse<Post>> {
    const response = await axiosClient.post("/posts", postData)
    return response.data
  }

  public static async getPost({
    id
  }: {
    id: string
  }): Promise<DataResponse<Post>> {
    const response = await axiosClient.get(`/posts/${id}`)
    return response.data
  }

  public static async updatePost({
    id,
    title,
    content,
    collectionId,
    imageUrl,
    link
  }: PostUpdateData): Promise<DataResponse<Post>> {
    const response = await axiosClient.put(`/posts/${id}`, {
      id,
      title,
      content,
      collectionId,
      imageUrl,
      link
    })
    return response.data
  }

  public static async deletePost({
    id
  }: {
    id: string
  }): Promise<DataResponse<Post>> {
    const response = await axiosClient.delete(`/posts/${id}`)
    return response.data
  }
}
