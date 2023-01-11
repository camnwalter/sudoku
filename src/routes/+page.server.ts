import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (({ cookies }) => {
  const cookie = cookies.get("gameID");

  if (cookie !== undefined) {
    throw redirect(307, `/play/${cookie}`);
  }
}) satisfies PageServerLoad;

export const prerender = true;
