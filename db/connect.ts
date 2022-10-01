import dotenv from "dotenv";
import { createClient } from "redis";
dotenv.config();

export const getClient = () => {
  if (!global.client) {
    const connection = createClient({
      url: process.env.REDIS_URL,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    });

    global.client = {
      connection,
    };

    console.log("creating a new redis client");
  }

  return global.client.connection!;
};
