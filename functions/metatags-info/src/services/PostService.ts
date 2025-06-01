import { Pool } from "../config/deps.ts";
import { log } from "../utils/logger.ts";
import { PostType, PostUpdate, type Post } from "../models/Post.ts";

const databaseUrl = Deno.env.get("SUPABASE_DB_URL") ?? "";

class PostService {
  private static pool = new Pool(databaseUrl, 3, true);

  public static async all(
    userId: string,
    collectionId: string = "",
    isUnCategorized: boolean = false,
    filter: string = "",
    offset: number = -1,
    limit: number = 50
  ) {
    const connection = await this.pool.connect();
    let query = "SELECT * FROM posts WHERE user_id = $USER_ID";
    const params: any = { user_id: userId };

    if (collectionId) {
      query += " AND collection_id = $COLLECTION_ID";
      params.collection_id = collectionId;
    }

    if (isUnCategorized) {
      query += " AND collection_id IS NULL";
    }

    if (filter) {
      query += " AND title LIKE $FILTER";
      params.filter = `%${filter}%`;
    }

    query += " AND deleted_at IS NULL";
    query += " ORDER BY created_at DESC";

    if (offset >= 0) {
      query += " OFFSET $OFFSET LIMIT $LIMIT";
      params.offset = offset;
      params.limit = limit;
    } else {
      query += " LIMIT $LIMIT";
      params.limit = limit;
    }

    const result = await connection.queryObject(query, params);
    connection.release();

    return result.rows;
  }

  public static async store(
    title: string,
    content: string,
    collectionId: string | null = null,
    userId: string = "",
    imageUrl: string | null = null,
    link: string | null = null
  ) {
    const connection = await this.pool.connect();
    const post: Post = {
      user_id: userId,
      title: title,
      image_url: imageUrl,
      link: link,
      content: content,
      collection_id: collectionId,
    };

    post.order = await connection
      .queryObject<{ order: { "?column?": number } }>(
        `SELECT COALESCE(MAX("order"), 0) + 1 FROM posts WHERE user_id = $1 AND collection_id = $2`,
        [userId, collectionId]
      )
      .then((res) => res.rows[0]["?column?"] || 0);

    const { type, title: computedTitle } = await this.computePostData(
      title,
      content
    );
    post.type = type;
    post.title = computedTitle;

    const query = `INSERT INTO posts (user_id, title, content, collection_id, created_at, updated_at, image_url, link, type, "order") 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;

    const params = [
      post.user_id,
      post.title,
      post.content,
      post.collection_id,
      post.created_at,
      post.updated_at,
      post.image_url,
      post.link,
      post.type,
      post.order,
    ];

    const result = await connection.queryObject<Post>(query, params);
    connection.release();

    if (result.rows.length === 0) {
      log("Failed to create post");
      return { data: null, error: "Failed to create post" };
    }

    post.id = result.rows[0].id;
    return { data: post, error: null };
  }

  public static async show(id: string) {
    const connection = await this.pool.connect();
    const result = await connection.queryObject<Post>(
      "SELECT * FROM posts WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    connection.release();

    if (result.rows.length === 0) {
      log(`Post with ID ${id} not found`);
      return { data: null, error: "Post not found" };
    }

    return { data: result.rows[0], error: null };
  }

  public static async update(id: string, data: PostUpdate) {
    const connection = await this.pool.connect();
    const query = `
      UPDATE posts
      SET title = $1, content = $2, image_url = $3, link = $4, collection_id = $5, updated_at = NOW()
      WHERE id = $6 AND deleted_at IS NULL
      RETURNING *
    `;
    const params = [
      data.title,
      data.content,
      data.image_url,
      data.link,
      data.collection_id,
      id,
    ];

    const result = await connection.queryObject<Post>(query, params);
    connection.release();

    if (result.rows.length === 0) {
      log(`Post with ID ${id} not found or update failed`);
      return { data: null, error: "Post not found or update failed" };
    }

    return { data: result.rows[0], error: null };
  }

  public static async delete(id: string) {
    const connection = await this.pool.connect();
    const result = await connection.queryObject<Post>(
      "UPDATE posts SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
      [id]
    );
    connection.release();

    if (result.rows.length === 0) {
      log(`Post with ID ${id} not found or already deleted`);
      return { data: null, error: "Post not found or already deleted" };
    }

    return { data: result.rows[0], error: null };
  }

  public static async computePostData(title: string, content: string) {
    const urlRegex = /(https?:\/\/)((\S+?\.|localhost:)\S+?)(?=\s|<|"|$)/;
    const matches = content.match(urlRegex) || [];
    const url = matches[0];

    log(`Extracted URL: ${url}`);

    return {
      type:
        matches.length > 0 ? PostType.POST_TYPE_LINK : PostType.POST_TYPE_TEXT,
      title: title,
    };
  }
}

export default PostService;
