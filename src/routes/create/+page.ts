import { board } from "$lib/store";
import type { PageLoad } from "./$types";

export const load = (async () => {
  board.makeEmpty();
}) satisfies PageLoad;
