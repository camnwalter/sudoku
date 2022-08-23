import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";

// 1. User goes to squagward.com/play/12345.
// 2. Fetches the data from .com/api/games/12345.
// 3. Update the board to that saved state.

export default function gameHandler(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req;

  switch (method) {
    case "POST":
      const uuid = v4();
      // if (!Object.values(o).includes(body)) {
      //   o[uuid] = body;
      // }
      res.status(200).json({ uuid });
      break;
    case "GET":
      // res.status(200).json(o);
      break;
  }
}
