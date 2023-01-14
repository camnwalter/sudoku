import { started, timer, won } from "$lib/store";
import type { PageLoad } from "./$types";

export const load = (async () => {
  timer.set(0);
  started.set(false);
  won.set(false);
}) satisfies PageLoad;
