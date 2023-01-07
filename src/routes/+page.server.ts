import client from "$src/database";
import { redirect } from "@sveltejs/kit";
import { getSudoku } from "sudoku-gen";
import type { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
import type { Actions, PageServerLoad } from "./$types";

export const load = (({ cookies }) => {
  const cookie = cookies.get("gameID");
  if (cookie !== undefined) {
    throw redirect(307, `/play/${cookie}`);
  }
}) satisfies PageServerLoad;

export const actions: Actions = {
  createBoard: async ({ request, cookies }) => {
    const data = await request.formData();
    const difficulty = data.get("difficulty") as Difficulty;
    const game = getSudoku(difficulty);

    const gameID = crypto.randomUUID();
    client.hsetnx("games", gameID, JSON.stringify(game));
    cookies.set("gameID", gameID);

    throw redirect(307, `/play/${gameID}`);
  },
};
