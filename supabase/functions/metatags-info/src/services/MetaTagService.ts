import { createClient, SupabaseClient } from "../config/deps.ts";
import { DOMParser, Element } from "../config/deps.ts";
import { uuid } from "../utils/helpers.ts";
import { log, logErr } from "../utils/logger.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

class MetaTagService {
  private static supabaseClient: SupabaseClient = createClient(
    supabaseUrl,
    supabaseKey,
  );

  private static imageBucket: string = "posts-media";

  public static async getMetaTags(url: string) {
    const headers = new Headers();
    headers.set("accept", "text/html,application/xhtml+xml,application/xml");
    headers.set(
      "user-agent",
      "Mozilla / 5.0 (Windows NT 10.0; Win64; x64) AppleWebKit / 537.36 (KHTML, like Gecko) Chrome / 89.0.142.86 Safari / 537.36",
    );
    const res = await fetch(url, { headers });
    const html = await res.text();
    const document = new DOMParser().parseFromString(html, "text/html");
    const metaTags = document.querySelectorAll("meta");
    const documentMeta = (Array.from(metaTags) as Element[]).reduce(
      (acc, meta) => {
        const property = meta.getAttribute("property");
        const name = meta.getAttribute("name");
        const content = meta.getAttribute("content");

        if (!content) return acc;
        if (property) acc[property] = content;
        if (name) acc[name] = content;

        return acc;
      },
      {} as Record<string, string>,
    );
    documentMeta.title ??= document.querySelector("title")?.textContent || "";

    return documentMeta;
  }

  public static async uploadImageToBucket(
    imageUrl: string,
    userId: string,
    imageName?: string,
  ) {
    if (!imageUrl) return null;
    const headers = new Headers();
    headers.set(
      "user-agent",
      "Mozilla / 5.0 (Windows NT 10.0; Win64; x64) AppleWebKit / 537.36 (KHTML, like Gecko) Chrome / 89.0.142.86 Safari / 537.36",
    );
    const fileUuid = uuid();
    const response = await fetch(imageUrl);
    const imageBlob = await response.blob();
    const { data, error } = await this.supabaseClient.storage
      .from(this.imageBucket)
      .upload(
        `stash-box/${userId}/${imageName || "og-image"}-${fileUuid}.png`,
        imageBlob,
        {
          cacheControl: "3600",
          upsert: true,
        },
      );
    if (error) {
      logErr(error);
      return null;
    }
    return data.path;
  }

  public static async getPublicUrl(imagePath: string | null) {
    if (!imagePath) return null;
    const { data } = await this.supabaseClient
      .storage
      .from(this.imageBucket)
      .getPublicUrl(imagePath);
    return data.publicUrl;
  }
}

export default MetaTagService;
