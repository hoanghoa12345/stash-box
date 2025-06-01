import { DataResponse, ICollection } from "@/types"
import axios from "axios"
import Cookies from "js-cookie"

class CollectionService {
  private static instance: CollectionService
  private apiUrl: string
  private authToken: string | null = null
  private userAuthorization: string | null = null

  private constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL
    this.authToken = import.meta.env.VITE_AUTHORIZE_TOKEN
  }

  public static getInstance(): CollectionService {
    if (!CollectionService.instance) {
      CollectionService.instance = new CollectionService()
    }
    CollectionService.instance.initializeAxios()
    return CollectionService.instance
  }

  private initializeAxios(): void {
    axios.defaults.baseURL = this.apiUrl
    axios.defaults.headers.common["Authorization"] = `Bearer ${this.authToken}`
  }

  public async getCollections({
    offset = -1,
    limit = 50
  }): Promise<DataResponse<ICollection[]>> {
    this.userAuthorization = Cookies.get("access_token") || null
    if (!this.userAuthorization) {
      throw new Error("User is not authenticated")
    }
    axios.defaults.headers.common["X-User-Authorization"] =
      `Bearer ${this.userAuthorization}`
    const response = await axios.get("/collections", {
      params: {
        offset,
        limit
      }
    })
    if (response.status !== 200) {
      throw new Error("Failed to fetch Collections")
    }
    return response.data
  }

  public async createCollection(
    name: string,
    icon: string
  ): Promise<DataResponse<ICollection>> {
    this.userAuthorization = Cookies.get("access_token") || null
    if (!this.userAuthorization) {
      throw new Error("User is not authenticated")
    }
    axios.defaults.headers.common["X-User-Authorization"] =
      `Bearer ${this.userAuthorization}`
    const response = await axios.post("/collections", {
      name,
      icon
    })
    if (response.status !== 201) {
      throw new Error("Failed to create Collection")
    }
    return response.data
  }
}

export default CollectionService.getInstance()
