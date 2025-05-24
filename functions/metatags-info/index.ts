import { Application } from "./src/config/deps.ts";
import router from "./src/router.ts";
import { log, logErr } from "./src/utils/logger.ts";

const app = new Application();

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

await app.listen();
