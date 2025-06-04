export interface DataResponse<T> {
  success: boolean
  status: string
  msg: string
  data: T
}

export interface UserData {
  user: User
  session: Session
}

export interface User {
  id: string
  aud: string
  role: string
  email: string
  email_confirmed_at: string
  phone: string
  confirmed_at: string
  last_sign_in_at: string
  app_metadata: unknown
  user_metadata: unknown
  identities: unknown[]
  created_at: string
  updated_at: string
  is_anonymous: boolean
}

export interface Session {
  access_token: string
  token_type: string
  expires_in: number
  expires_at: number
  refresh_token: string
  user: User
}

export interface Post {
  id: string
  user_id: string
  title: string
  content: string
  image_url: string
  link: string
  collection_id: string
  created_at: string
  updated_at: string
  type: number
  order: number
  deleted_at: string | null
  collection_name?: string
}

export interface ICollection {
  id: string | null
  user_id: string
  name: string
  created_at: string
  parent_id: string | null
  icon: string
  updated_at: string
  deleted_at: string | null
  total_posts?: number
}

export interface PostCreateData {
  title: string
  content: string
  collectionId?: string | null
  imageUrl?: string | null
  link?: string | null
}

export interface PostUpdateData {
  id: string
  title: string
  content: string
  collectionId?: string | null
  imageUrl?: string | null
  link?: string | null
}

export interface ApiError extends Error {
  response: {
    data: {
      success: boolean
      status: string
      msg: string
    }
  }
}

export type ToastInstance = {
  error: (message: string) => void
  success: (message: string) => void
}

export type LoginRequest = {
  email: string
  password: string
}

export type FailedRequest = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

export type UpsetCollection = {
  name: string
  icon: string
  collectionId?: string | null
}
