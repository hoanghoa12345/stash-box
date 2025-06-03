import { DataResponse, LoginRequest, User, UserData } from "@/types"
import axios from "axios"
import Cookies from "js-cookie"
import axiosClient from "./axiosClient"

export class AuthService {
  public static async login({
    email,
    password
  }: LoginRequest): Promise<DataResponse<UserData>> {
    const response = await axiosClient.post("/sign-in", {
      email,
      password
    })
    return response.data
  }

  public static async getUser(): Promise<DataResponse<User>> {
    const response = await axiosClient.get("/user")
    return response.data
  }

  public static async refreshToken(refreshToken: string) {
    const response = await axiosClient.post("/refresh-token", {
      refresh_token: refreshToken
    })
    return response.data
  }

  public static async logout(): Promise<void> {
    await axios.post("/sign-out")
    Cookies.remove("access_token")
    Cookies.remove("refresh_token")
  }
}
