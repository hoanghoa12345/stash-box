import { green, red, yellow } from "../config/deps.ts";

function formatLogMessage(messages: unknown[]) {
  return messages
    .map((msg: unknown) =>
      typeof msg === "string" ? msg : JSON.stringify(msg)
    )
    .join(" ");
}

export function log(...messages: unknown[]) {
  console.log(yellow(formatLogMessage(messages)));
}

export function logSuccess(...messages: unknown[]) {
  console.log(green(formatLogMessage(messages)));
}

export function logErr(...errors: Error[]) {
  errors.forEach((err) => console.error(red(err.stack || "")));
}
