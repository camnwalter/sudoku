import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { CellData } from "../src/utils/types";
const apiPort = 4000;

const app = express();

app.use(cors(), express.json());

const TEMP_DATABASE: Record<string, CellData[]> = {};

app.post("/save", (req, res) => {
  const { board } = req.body;
  const uuid = uuidv4();
  TEMP_DATABASE[uuid] = board;
  res.send(uuid);
});

app.get("/play/:id", (req, res) => {
  const { id } = req.params;
  res.send(TEMP_DATABASE[id]);
});

app.listen(apiPort, () => {
  console.log(`Sudoku listening on port ${apiPort}`);
});
