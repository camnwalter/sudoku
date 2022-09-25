import type { NextApiRequest, NextApiResponse } from "next";
import { addGame } from "../../../db/redis";
import { BoardNumber } from "../../../utils/types";

export default async function gameHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req;

  switch (method) {
    case "POST":
      const uuid = await addGame(body as BoardNumber[]);
      res.status(200).json({ uuid });
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
