import client from "$db";
import { isValidSolution } from "$lib/isValidSolution";
import type { Cell } from "$lib/store";
import { error, redirect } from "@sveltejs/kit";
import type { Sudoku } from "sudoku-gen/dist/types/sudoku.type";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ params, cookies }) => {
  const puzzle = await client.hget("games", params.id);

  if (puzzle === null) {
    throw error(404, "Not Found");
  }

  cookies.set("gameID", params.id, {
    path: "/",
  });

  const board = [...puzzle].map<Cell>((char) => {
    const num = parseInt(char);
    return {
      number: num || 0,
      locked: !Number.isNaN(num),
      corners: [],
      centers: [],
    };
  });

  return {
    board,
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  checkBoard: async ({ request }) => {
    const formData = await request.formData();

    const board = formData.get("board") as string;

    return {
      success: isValidSolution(board),
    };
  },

  giveUp: async ({ cookies }) => {
    cookies.delete("gameID", {
      path: "/",
    });
    throw redirect(307, "/");
  },
};
