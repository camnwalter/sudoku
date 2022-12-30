import { selectedCells } from "./store";

// Adapted from https://github.com/SarcevicAntonio/as-comps/blob/cb1f38b1ceff0c7149ea401c7c4d631fa351524c/src/lib/actions/focus.ts
export const arrowKeyFocus = (
  element: HTMLElement,
  index: number
): { destroy(): void } => {
  const handleKeydown = (event: KeyboardEvent) => {
    event.preventDefault();

    const row = Math.floor(index / 9);
    const col = index % 9;
    const cells = document.getElementsByClassName("cell");

    switch (event.key) {
      case "ArrowUp":
      case "KeyW":
        if (row > 0) {
          selectedCells.update((prev) => prev.map((_, i) => i === index - 9));
          (cells[index - 9] as HTMLElement).focus();
        }
        break;
      case "ArrowLeft":
      case "KeyA":
        if (col > 0) {
          selectedCells.update((prev) => prev.map((_, i) => i === index - 1));
          (cells[index - 1] as HTMLElement).focus();
        }
        break;
      case "ArrowDown":
      case "KeyS":
        if (row < 8) {
          selectedCells.update((prev) => prev.map((_, i) => i === index + 9));
          (cells[index + 9] as HTMLElement).focus();
        }
        break;
      case "ArrowRight":
      case "KeyD":
        if (col < 8) {
          selectedCells.update((prev) => prev.map((_, i) => i === index + 1));
          (cells[index + 1] as HTMLElement).focus();
        }
        break;
    }
  };

  const handleFocusIn = () => {
    element.addEventListener("keydown", handleKeydown);
  };

  const handleFocusOut = () => {
    element.removeEventListener("keydown", handleKeydown);
  };

  element.addEventListener("focusin", handleFocusIn);
  element.addEventListener("focusout", handleFocusOut);

  return {
    destroy() {
      element.removeEventListener("focusin", handleFocusIn);
      element.removeEventListener("focusout", handleFocusOut);
    },
  };
};
