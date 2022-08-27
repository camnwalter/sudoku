import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";
import { addGame, getGames } from "../../../db/dynamo";

export default async function gameHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req;

  switch (method) {
    case "POST":
      const uuid = v4();
      addGame(uuid, body);
      res.status(200).json({ uuid });
      break;
    case "GET":
      const data = await getGames();
      res.status(200).json(data);
      break;
    default:
      res
        .status(405)
        .end(
          "Unsupported operation! /api/games is only accessible via GET or POST"
        );
      break;
  }
}
