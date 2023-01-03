import type { Handle } from "@sveltejs/kit";
import client from "./database";

client.connect().then(() => console.log("connected to redis"));

export const handle = (({ event, resolve }) => {
  return resolve(event);
}) satisfies Handle;
