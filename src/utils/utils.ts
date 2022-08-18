import React from "react";

export const SIZE = 9;

export const locationToIndex = (row: number, col: number) => row * SIZE + col;

export const isShiftDown = (e: React.KeyboardEvent<HTMLDivElement>) =>
  e.shiftKey ||
  (e.code.startsWith("Numpad") &&
    (e.key.startsWith("Arrow") ||
      e.key === "Home" ||
      e.key === "End" ||
      e.key === "Clear" ||
      e.key.startsWith("Page")));

export enum MoveTypes {
  Number,
  Corner,
  Center,
}

export const deepClone = (object: unknown): unknown => {
  if (object === null || typeof object !== "object") return object;

  if (Array.isArray(object)) {
    return object.map(deepClone);
  }

  if (object instanceof Object) {
    return Object.fromEntries(
      Object.entries(object).map(([k, v]) => [k, deepClone(v)])
    );
  }

  throw new Error("Unsupported type to deep clone!");
};

export const isEqual = (obj1: unknown, obj2: unknown): boolean => {
  if (obj1 === obj2) return true;

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    return (obj1 as unknown[]).every((cell, i) =>
      isEqual(cell, (obj2 as unknown[])[i])
    );
  }

  if (obj1 instanceof Object && obj2 instanceof Object) {
    return isEqual(Object.entries(obj1), Object.entries(obj2));
  }

  return false;
};

export enum Environment {
  Sandbox,
  Play,
  Basic,
}
