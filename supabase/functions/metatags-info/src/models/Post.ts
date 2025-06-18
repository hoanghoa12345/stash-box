export interface Post {
  id?: string | null;
  user_id: string;
  title: string;
  content: string;
  image_url: string | null;
  link: string | null;
  collection_id: string | null;
  created_at?: string;
  updated_at?: string;
  type?: number;
  order?: number;
  deleted_at?: string | null;
  image_original_url?: string | null;
}
export enum PostType {
  POST_TYPE_TEXT = 1,
  POST_TYPE_LINK = 2,
}

export interface PostUpdate {
  user_id: string;
  title: string;
  content: string;
  image_url: string | null;
  link: string | null;
  collection_id: string | null;
  type?: number;
  order?: number;
}
