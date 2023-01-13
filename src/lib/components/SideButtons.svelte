<script lang="ts">
  import { addNumber } from "$lib/addNumber";
  import { isValidSolution } from "$lib/isValidSolution";
  import {
    board,
    buttonState,
    resetCellIfPossible,
    selectedCells,
    won,
    type ButtonState,
    type Cell,
  } from "$lib/store";
  import toast from "svelte-french-toast";

  let fallbackType: ButtonState = "normal";
  const toggle = (type: ButtonState) => {
    fallbackType = type;
    buttonState.set(type);
  };

  const deleteCellData = () => {
    $selectedCells.forEach((cell, i) => {
      if (cell) {
        board.update((cells) => {
          cells[i] = resetCellIfPossible(cells[i]);
          return cells;
        });
      }
    });
  };

  const checkBoard = (puzzle: Cell[]) => {
    if (isValidSolution(puzzle)) {
      won.set(true);
      toast.success("Congratulations, you won!", {
        style: "font-size: 1.5rem",
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      buttonState.set("corner");
    } else if (event.shiftKey) {
      buttonState.set("center");
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.code.startsWith("Control") || event.code.startsWith("Shift")) {
      buttonState.set(fallbackType);
    }
  };
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />

<div class="outer">
  <div class="sideButtons">
    <div class="row">
      <div class="square" on:mousedown={(e) => addNumber(e, 1)}>1</div>
      <div class="square" on:mousedown={(e) => addNumber(e, 2)}>2</div>
      <div class="square" on:mousedown={(e) => addNumber(e, 3)}>3</div>
    </div>
    <div class="row">
      <div class="square" on:mousedown={(e) => addNumber(e, 4)}>4</div>
      <div class="square" on:mousedown={(e) => addNumber(e, 5)}>5</div>
      <div class="square" on:mousedown={(e) => addNumber(e, 6)}>6</div>
    </div>
    <div class="row">
      <div class="square" on:mousedown={(e) => addNumber(e, 7)}>7</div>
      <div class="square" on:mousedown={(e) => addNumber(e, 8)}>8</div>
      <div class="square" on:mousedown={(e) => addNumber(e, 9)}>9</div>
    </div>
    <div class="row">
      <div on:mousedown={deleteCellData}>Delete</div>
    </div>
    <div class="row">
      <div on:mousedown={() => board.undo()}>Undo</div>
      <div on:mousedown={() => board.redo()}>Redo</div>
    </div>
  </div>

  <div class="pad" />

  <div class="sideButtons">
    <div class="row">
      <button
        class="smaller"
        tabindex="-1"
        disabled={$buttonState === "normal"}
        on:mousedown={() => toggle("normal")}>Normal</button
      >
      <button
        class="smaller"
        tabindex="-1"
        disabled={$buttonState === "corner"}
        on:mousedown={() => toggle("corner")}>Corner</button
      >
      <button
        class="smaller"
        tabindex="-1"
        disabled={$buttonState === "center"}
        on:mousedown={() => toggle("center")}>Center</button
      >
    </div>
  </div>

  <div class="pad" />

  <div class="sideButtons">
    <div class="row">
      <div on:mousedown={() => board.reset()}>Reset</div>
      <div on:mousedown={() => checkBoard($board)}>Check</div>
    </div>
  </div>
</div>

<style>
  .outer {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }

  .sideButtons {
    background-color: var(--lighter);
    border-radius: 10px;
    border: 3px solid var(--main-color);
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .row > div,
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: white;
    border: 1px solid var(--main-color);
    cursor: pointer;
    user-select: none;
    background-color: rgba(0, 0, 0, 0);
    padding: 10px;
  }

  .row > div:not(.smaller),
  button {
    font-size: 2rem;
  }

  .row > div:hover,
  button:hover {
    background-color: var(--lightest);
    color: black;
  }

  button:disabled {
    background-color: var(--even-lighter);
    color: black;
  }

  .square {
    aspect-ratio: 1 / 1;
  }

  .smaller {
    font-size: 1rem;
  }
</style>
