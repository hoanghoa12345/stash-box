import { corsOptions } from "./src/config/cors.ts";
import { Application, oakCors } from "./src/config/deps.ts";
import router from "./src/routes/routes.ts";
import { log, logErr } from "./src/utils/logger.ts";

const app = new Application();

app.use(oakCors(corsOptions));
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("error", (e) => logErr(e.error));
app.addEventListener("listen", ({ hostname, port, secure }) => {
  log(
    `Listening on: ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`
  );
});

await app.listen({port: 8080});
