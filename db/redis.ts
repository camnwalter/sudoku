import { config } from "dotenv";
import { createClient, RedisClientType } from "redis";
import { Game } from "../utils/types";
import { getUniqueCode } from "../utils/utils";
config();

declare global {
  var client: RedisClientType;
}

let client = global.client;

const BOARD_HASH = "board";

const connect = async () => {
  if (!global.client) {
    global.client = createClient({
      url: process.env.REDIS_URL,
    });
    client = global.client;
  }

  if (!client.isReady) {
    await client.connect();
  }
};

client?.on("error", (err) => console.error("Redis Error:", err));

export const getGame = async (id: string): Promise<Game | null> => {
  await connect();

  const board = await client.hGet(BOARD_HASH, id);

  if (board === undefined) {
    return null;
  }

  return JSON.parse(board);
};

export const addGame = async (body: Game) => {
  await connect();

  let id;
  do {
    id = getUniqueCode(8);
  } while ((await client.get(id)) !== null);

  await client.hSet(BOARD_HASH, id, JSON.stringify(body));

  return id;
};

export const getAllGames = async (): Promise<Record<string, Game>> => {
  await connect();

  const keys = await client.hGetAll(BOARD_HASH);

  return Object.entries(keys).reduce((a, [key, value]) => {
    a[key] = JSON.parse(value);
    return a;
  }, {} as Record<string, Game>);
};
