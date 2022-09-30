import { createClient } from "redis";
import { BoardNumber } from "../utils/types";
import { getUniqueCode } from "../utils/utils";
import dotenv from "dotenv";
dotenv.config();

const BOARD_HASH = "board";

const client = createClient({
  url: process.env.REDIS_URL,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

client.on("error", (err) => console.error("Redis Error:", err));

(async () => await client.connect())();

export const getGame = async (id: string): Promise<BoardNumber[] | null> => {
  const board = await client.hGet(BOARD_HASH, id);

  if (board === undefined) {
    return null;
  }

  return JSON.parse(board);
};

export const addGame = async (body: BoardNumber[]) => {
  let id = getUniqueCode(8);
  while ((await client.get(id)) !== null) {
    id = getUniqueCode(8);
  }

  await client.hSet(BOARD_HASH, id, JSON.stringify(body));

  return id;
};

export const getAllGames = async (): Promise<Record<string, BoardNumber[]>> => {
  const keys = await client.hGetAll(BOARD_HASH);

  return Object.entries(keys).reduce((a, [key, value]) => {
    a[key] = JSON.parse(value);
    return a;
  }, {} as Record<string, BoardNumber[]>);
};
