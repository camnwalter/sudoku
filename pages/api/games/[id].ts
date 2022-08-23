import { NextApiRequest, NextApiResponse } from "next";
import { getGame } from "../../../db/dynamo";

export default async function gameHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { id },
  } = req;

  switch (method) {
    case "GET":
      const game = await getGame(id as string);
      if (Array.isArray(game)) {
        res.status(200).json(game);
      }
      break;
    default:
      res
        .status(405)
        .end(
          "Unsupported operation! /api/games/:id is only accessible via GET"
        );
      break;
  }
}
