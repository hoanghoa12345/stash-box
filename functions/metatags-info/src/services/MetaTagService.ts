import { DOMParser, Element } from "../config/deps.ts";

export default {
  getMetaTags: async (url: string) => {
    const headers = new Headers();
    headers.set("accept", "text/html,application/xhtml+xml,application/xml");
    headers.set(
      "user-agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
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
      {} as Record<string, string>
    );
    documentMeta.title ??= document.querySelector("title").textContent;

    return documentMeta;
  },
};
