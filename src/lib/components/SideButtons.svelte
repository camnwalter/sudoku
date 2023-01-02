<script lang="ts">
  import { addNumber } from "$lib/addNumber";
  import { board, resetCellIfPossible, selectedCells } from "$lib/store";
  import { get } from "svelte/store";

  const handleUndoRedo = (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      if (event.code === "KeyZ") {
        board.undo();
      } else if (event.code === "KeyY") {
        board.redo();
      }
    }
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
</script>

<svelte:window on:keydown={handleUndoRedo} />

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
  <div class="row">
    <div on:mousedown={() => board.reset()}>Reset</div>
  </div>
</div>

<style>
  .sideButtons {
    margin-top: 1rem;
    background-color: var(--lighter);
    border-radius: 10px;
    border: 3px solid var(--main-color);
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .row > div {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    width: 100%;
    color: white;
    border: 1px solid var(--main-color);
    cursor: pointer;
    user-select: none;
  }

  .row > div:hover {
    background-color: var(--lightest);
    color: black;
  }

  .square {
    aspect-ratio: 1 / 1;
  }
</style>
