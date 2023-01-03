import type { Cell } from "$lib/store";
import { getSudoku } from "sudoku-gen";
import type { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import type { Sudoku } from "sudoku-gen/dist/types/sudoku.type";
import client from "../database";
import type { Actions } from "./$types";

export const actions: Actions = {
  createBoard: async ({ request, cookies }) => {
    const data = await request.formData();
    const difficulty = data.get("difficulty") as Difficulty;
    const game = getSudoku(difficulty);

    const board = [...game.puzzle].map<Cell>((char, i) => {
      const num = parseInt(char);
      return {
        number: num || 0,
        locked: !Number.isNaN(num),
        corners: [],
        centers: [],
      };
    });

    const gameID = crypto.randomUUID();
    client.hsetnx("games", gameID, JSON.stringify(game));
    cookies.set("gameID", gameID);

    return {
      board,
    };
  },

  checkBoard: async ({ request, cookies }) => {
    const cookie = cookies.get("gameID");
    if (cookie !== undefined) {
      const game = await client.hget("games", cookie);
      if (game !== null) {
        const { solution } = JSON.parse(game) as Sudoku;
        const formData = await request.formData();

        const board = formData.get("board");

        return {
          success: board === solution,
        };
      }
    }
  },
};
