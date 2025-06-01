import { createClient, SupabaseClient } from "../config/deps.ts";
import {
  Collection,
  CollectionCreate,
  CollectionDelete,
  CollectionUpdate,
} from "../models/Collection.ts";
import { log } from "../utils/logger.ts";
import { Pool } from "../config/deps.ts";

const databaseUrl = Deno.env.get("SUPABASE_DB_URL") ?? "";

class CollectionService {
  private static pool = new Pool(databaseUrl, 3, true);

  public static async all(
    userId: string,
    offset: number = -1,
    limit: number = 50
  ) {
    const connection = await this.pool.connect();
    let query =
      "SELECT * FROM collections WHERE user_id = $1 AND deleted_at IS NULL";
    const params: unknown[] = [userId];

    if (offset >= 0) {
      query += " ORDER BY created_at DESC OFFSET $2 LIMIT $3";
      params.push(offset, limit);
    } else {
      query += " ORDER BY created_at DESC LIMIT $2";
      params.push(limit);
    }

    const result = await connection.queryObject<Collection>(query, params);
    connection.release();

    return result.rows;
  }

  public static async show(id: string) {
    const connection = await this.pool.connect();
    const result = await connection.queryObject<Collection>(
      "SELECT * FROM collections WHERE id = $1",
      [id]
    );
    connection.release();
    if (result.rows.length === 0) {
      log("Collection not found");
      return { data: null, error: "Collection not found" };
    }
    return { data: result.rows[0], error: null };
  }

  public static async store(data: CollectionCreate) {
    const collection: Collection = {
      id: null,
      user_id: data.userId,
      name: data.name,
      created_at: new Date().toISOString(),
      parent_id: data.parentCollectionId,
      icon: data.icon,
    };
    const connection = await this.pool.connect();

    const result = await connection.queryObject<Collection>(
      "INSERT INTO collections (user_id, name, created_at, parent_id, icon) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        data.userId,
        data.name,
        collection.created_at,
        data.parentCollectionId,
        data.icon,
      ]
    );
    connection.release();
    if (result.rows.length === 0) {
      log("Failed to create collection");
      return { data: null, error: "Failed to create collection" };
    }
    collection.id = result.rows[0].id;
    return { data: collection, error: null };
  }

  public static async update(data: CollectionUpdate) {
    const connection = await this.pool.connect();
    const query = `
      UPDATE collections
      SET name = $1, parent_id = $2, icon = $3
      WHERE id = $4 AND user_id = $5
      RETURNING *
    `;
    const params = [
      data.name,
      data.isRoot ? null : data.parentCollectionId,
      data.icon,
      data.id,
      data.userId,
    ];
    const result = await connection.queryObject<Collection>(query, params);
    connection.release();
    if (result.rows.length === 0) {
      log("Failed to update collection");
      return { data: null, error: "Failed to update collection" };
    }
    return { data: result.rows[0], error: null };
  }

  public static async delete(data: CollectionDelete) {
    const connection = await this.pool.connect();
    let query =
      "UPDATE collections SET deleted_at = NOW() WHERE id = $1 AND user_id = $2";
    const params = [data.id, data.userId];
    if (data.isNested) {
      query += " OR parent_id = $3";
      params.push(data.id);
    }

    const result = await connection.queryObject(query, params);
    connection.release();
    if (result.rowCount === 0) {
      log("Failed to delete collection");
      return { data: null, error: "Failed to delete collection" };
    }
    return { data: { id: data.id }, error: null };
  }
}

export default CollectionService;
