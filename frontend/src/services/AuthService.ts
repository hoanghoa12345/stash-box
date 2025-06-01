import { DataResponse, User, UserData } from "@/types"
import axios from "axios"
import Cookies from "js-cookie"

class AuthService {
  private static instance: AuthService
  private apiUrl: string
  private authToken: string | null = null
  private userAuthorization: string | null = null

  private constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL
    this.authToken = import.meta.env.VITE_AUTHORIZE_TOKEN
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    AuthService.instance.initializeAxios()
    return AuthService.instance
  }

  async login(
    email: string,
    password: string
  ): Promise<DataResponse<UserData>> {
    try {
      const response = await axios.post(`${this.apiUrl}/sign-in`, {
        email,
        password
      })
      return response.data
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }
  private initializeAxios(): void {
    axios.defaults.baseURL = this.apiUrl
    axios.defaults.headers.common["Authorization"] = `Bearer ${this.authToken}`
  }

  async getUserData(): Promise<DataResponse<User>> {
    try {
      this.userAuthorization = Cookies.get("access_token") || null
      if (!this.userAuthorization) {
        throw new Error("User is not authenticated")
      }
      axios.defaults.headers.common["X-User-Authorization"] =
        `Bearer ${this.userAuthorization}`
      const response = await axios.get("/user")
      return response.data
    } catch (error) {
      console.error("Failed to fetch user data:", error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post("/sign-out")
      this.authToken = null
      this.userAuthorization = null
    } catch (error) {
      console.error("Logout failed:", error)
      throw error
    }
  }
}

export default AuthService.getInstance()
