import { NextApiRequest, NextApiResponse } from "next";

export default function gameHandler(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req;

  switch (method) {
    case "GET":
    // res.status(200).json(o);
    default:
      res.status(400).end("Unsupported operation!");
  }
}
