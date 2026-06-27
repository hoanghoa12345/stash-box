import {
  Collection,
  CollectionCreate,
  CollectionDelete,
  CollectionUpdate,
} from "./types.ts";
import { log } from "../../utils/logger.ts";
import { db } from "../../core/database/index.ts";

export class CollectionService {
  public static async all(
    userId: string,
    offset: number = -1,
    limit: number = 50
  ) {
    log(`Fetching all collections for user ${userId}`);
    let query = `SELECT c.id, c.name, c.parent_id, c.icon, c.updated_at, COUNT(p.id) AS total_posts 
        FROM sb_collections c LEFT JOIN sb_posts p ON c.id=p.collection_id 
        WHERE c.user_id=$1 AND c.deleted_at IS NULL AND p.deleted_at IS NULL GROUP BY c.id, c.name`;
    const params: unknown[] = [userId];

    if (offset >= 0) {
      query += " ORDER BY c.created_at DESC OFFSET $2 LIMIT $3";
      params.push(offset, limit);
    } else {
      query += " ORDER BY c.created_at DESC LIMIT $2";
      params.push(limit);
    }

    const result = await db.query(query, params);

    result.rows.forEach((collection) => {
      collection.icon = collection.icon || "📂";
      collection.parent_id = collection.parent_id || null;
      collection.updated_at = collection.updated_at || new Date().toISOString();
      collection.total_posts =
        parseInt(collection.total_posts as unknown as string, 10) || 0;
      collection.created_at = collection.created_at || new Date().toISOString();
    });

    return result.rows;
  }

  public static async show(id: string) {
    const query = "SELECT * FROM sb_collections WHERE id = $1";
    const params = [id];
    const result = await db.query(query, params);
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
    const query =
      "INSERT INTO sb_collections (user_id, name, created_at, parent_id, icon) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const params = [
      data.userId,
      data.name,
      collection.created_at,
      data.parentCollectionId,
      data.icon,
    ];

    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      log("Failed to create collection");
      return { data: null, error: "Failed to create collection" };
    }
    collection.id = result.rows[0].id;
    return { data: collection, error: null };
  }

  public static async update(data: CollectionUpdate) {
    const query = `
      UPDATE sb_collections
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
    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      log("Failed to update collection");
      return { data: null, error: "Failed to update collection" };
    }
    return { data: result.rows[0], error: null };
  }

  public static async delete(data: CollectionDelete) {
    let query =
      "UPDATE sb_collections SET deleted_at = NOW() WHERE id = $1 AND user_id = $2";
    const params = [data.id, data.userId];
    if (data.isNested) {
      query += " OR parent_id = $3";
      params.push(data.id);
    }
    const result = await db.query(query, params);
    if (result.rowCount === 0) {
      log("Failed to delete collection");
      return { data: null, error: "Failed to delete collection" };
    }
    return { data: { id: data.id }, error: null };
  }
}
