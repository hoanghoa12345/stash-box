import { DataResponse, ICollection } from "@/types"
import axiosClient from "./axiosClient"

export class CollectionService {
  public static async getCollections({
    offset = -1,
    limit = 50
  }): Promise<DataResponse<ICollection[]>> {
    const response = await axiosClient.get("/collections", {
      params: {
        offset,
        limit
      }
    })
    return response.data
  }

  public static async createCollection({
    name,
    icon
  }: {
    name: string
    icon: string
  }): Promise<DataResponse<ICollection>> {
    const response = await axiosClient.post("/collections", {
      name,
      icon
    })
    return response.data
  }

  public static async updateCollection({
    id,
    name,
    icon
  }: {
    id: string
    name: string
    icon: string
  }): Promise<DataResponse<ICollection>> {
    const response = await axiosClient.put("/collections", {
      id,
      name,
      icon,
      isRoot: true
    })
    return response.data
  }

  public static async removeCollection({
    id
  }: {
    id: string
  }): Promise<DataResponse<ICollection>> {
    return axiosClient.delete("/collections", {
      data: {
        id,
        isNested: false
      }
    })
  }
}
