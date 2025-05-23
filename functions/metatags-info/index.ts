import { Application } from "./src/config/deps.ts";
import router from "./src/router.ts";
import { log, logErr } from "./src/utils/logger.ts";

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

// Event listeners
app.addEventListener("error", (e) => logErr(e.error));
app.addEventListener("listen", ({ hostname, port, secure }) => {
  log(
    `Listening on: ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`
  );
});

await app.listen();

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// interface reqPayload {
//   name: string;
// }
// console.info("server started");
// Deno.serve(async (req: Request) => {
//   const { name }: reqPayload = await req.json();
//   const data = {
//     message: `Hello ${name}!`,
//   };
//   return new Response(JSON.stringify(data), {
//     headers: { "Content-Type": "application/json", Connection: "keep-alive" },
//   });
// });
