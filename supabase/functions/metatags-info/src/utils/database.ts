import { QueryObjectResult } from "jsr:@db/postgres";
import { Pool } from "../config/deps.ts";

class Database {
  private pool: Pool;

  constructor(databaseUrl: string) {
    this.pool = new Pool(databaseUrl, 3, true);
  }

  public async query<T>(
    text: string,
    args: unknown[] = []
  ): Promise<QueryObjectResult<T>> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<T>(text, args);
      return result;
    } finally {
      client.release();
    }
  }
}

export default Database;
