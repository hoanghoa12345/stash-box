import { DataResponse, Post, PostCreateData } from "@/types"
import axios from "axios"
import Cookies from "js-cookie"

class PostService {
  private static instance: PostService
  private apiUrl: string
  private authToken: string | null = null
  private userAuthorization: string | null = null

  private constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL
    this.authToken = import.meta.env.VITE_AUTHORIZE_TOKEN
  }

  public static getInstance(): PostService {
    if (!PostService.instance) {
      PostService.instance = new PostService()
    }
    PostService.instance.initializeAxios()
    return PostService.instance
  }

  private initializeAxios(): void {
    axios.defaults.baseURL = this.apiUrl
    axios.defaults.headers.common["Authorization"] = `Bearer ${this.authToken}`
    this.userAuthorization = Cookies.get("access_token") || null
    if (!this.userAuthorization) {
      throw new Error("User is not authenticated")
    }
    axios.defaults.headers.common["X-User-Authorization"] =
      `Bearer ${this.userAuthorization}`
  }

  public async getPosts({
    collectionId = "",
    isUnCategorized = false,
    filter = "",
    offset = -1,
    limit = 50
  }): Promise<DataResponse<Post[]>> {
    const response = await axios.get("/posts", {
      params: {
        collection_id: collectionId,
        is_uncategorized: isUnCategorized,
        filter,
        offset,
        limit
      }
    })
    if (response.status !== 200) {
      throw new Error("Failed to fetch posts")
    }
    return response.data
  }

  public async createPost(
    postData: PostCreateData
  ): Promise<DataResponse<Post>> {
    const response = await axios.post("/posts", postData)
    if (response.status !== 201) {
      throw new Error("Failed to create post")
    }
    return response.data
  }
}

export default PostService.getInstance()
