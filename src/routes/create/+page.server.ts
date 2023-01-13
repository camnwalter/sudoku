import client from "$db";
import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  createCustomBoard: async ({ request, cookies }) => {
    const formData = await request.formData();
    const puzzle = formData.get("board") as string;

    const gameID = crypto.randomUUID();
    await client.hsetnx("games", gameID, puzzle);
    cookies.set("gameID", gameID, {
      path: "/",
    });

    throw redirect(307, `/play/${gameID}`);
  },
};
