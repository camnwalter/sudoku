import { writable } from "svelte/store";

export const mouseState = writable(false);

export const selectedNumbers = writable<number[]>([]);
export const selectedCells = writable<boolean[]>(Array(81).fill(false));
