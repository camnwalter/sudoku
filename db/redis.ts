import { Game } from "../utils/types";
import { getUniqueCode } from "../utils/utils";
import { getClient } from "./connect";

const client = getClient();

if (!client.isReady) {
  console.log("connecting...");
  (async () => await client.connect())();
}

client.on("error", (err) => console.error("Redis Error:", err));

const BOARD_HASH = "board";

export const getGame = async (id: string): Promise<Game | null> => {
  const board = await client.hGet(BOARD_HASH, id);

  if (board === undefined) {
    return null;
  }

  return JSON.parse(board);
};

export const addGame = async (body: Game) => {
  let id = getUniqueCode(8);
  while ((await client.get(id)) !== null) {
    id = getUniqueCode(8);
  }

  await client.hSet(BOARD_HASH, id, JSON.stringify(body));

  return id;
};

export const getAllGames = async (): Promise<Record<string, Game>> => {
  const keys = await client.hGetAll(BOARD_HASH);

  return Object.entries(keys).reduce((a, [key, value]) => {
    a[key] = JSON.parse(value);
    return a;
  }, {} as Record<string, Game>);
};
