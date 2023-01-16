import { board } from "$lib/store";
import type { PageLoad } from "./$types";

export const load = (async () => {
  board.set(
    Array(81)
      .fill(0)
      .map(() => ({
        number: 0,
        locked: false,
        corners: [],
        centers: [],
      }))
  );
}) satisfies PageLoad;
