import client from "$db";
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
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const difficulty = data.get("difficulty") as Difficulty | null;
    const code = data.get("code") as string;

    if (difficulty !== null && code === "") {
      const { puzzle } = getSudoku(difficulty);

      const gameID = crypto.randomUUID();
      client.hsetnx("games", gameID, puzzle);
      cookies.set("gameID", gameID, {
        path: "/",
      });
      throw redirect(307, `/play/${gameID}`);
    }

    const puzzle = await client.hget("games", code);
    if (puzzle !== null) {
      cookies.set("gameID", code, {
        path: "/",
      });
      throw redirect(307, `/play/${code}`);
    }
  },
};
