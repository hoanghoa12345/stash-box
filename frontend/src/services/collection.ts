import { DataResponse, ICollection } from "@/types"
import axiosClient from "./axiosClient"

export const CollectionService = {
  getCollections: async ({
    offset = -1,
    limit = 50
  }): Promise<DataResponse<ICollection[]>> => {
    const { data } = await axiosClient.get("/collections", {
      params: {
        offset,
        limit
      }
    })
    return data
  },
  createCollection: async ({
    name,
    icon
  }: {
    name: string
    icon: string
  }): Promise<DataResponse<ICollection>> => {
    return axiosClient.post("/collections", {
      name,
      icon
    })
  },
  updateCollection: async ({
    id,
    name,
    icon
  }: {
    id: string
    name: string
    icon: string
  }): Promise<DataResponse<ICollection>> => {
    return axiosClient.put(`/collections/${id}`, {
      name,
      icon
    })
  },
  removeCollection: async (id: string): Promise<DataResponse<ICollection>> => {
    return axiosClient.delete(`/collections/${id}`)
  }
}
