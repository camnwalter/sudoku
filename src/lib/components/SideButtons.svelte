<script lang="ts">
  import { page } from "$app/stores";
  import { addNumber } from "$lib/addNumber";
  import {
    board,
    buttonState,
    resetCellIfPossible,
    selectedCells,
    type ButtonState,
  } from "$lib/store";

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
  <div class="numbers">
    <div class="row">
      <div class="square" on:pointerdown={(e) => addNumber(e, 1)}>1</div>
      <div class="square" on:pointerdown={(e) => addNumber(e, 2)}>2</div>
      <div class="square" on:pointerdown={(e) => addNumber(e, 3)}>3</div>
    </div>
    <div class="row">
      <div class="square" on:pointerdown={(e) => addNumber(e, 4)}>4</div>
      <div class="square" on:pointerdown={(e) => addNumber(e, 5)}>5</div>
      <div class="square" on:pointerdown={(e) => addNumber(e, 6)}>6</div>
    </div>
    <div class="row">
      <div class="square" on:pointerdown={(e) => addNumber(e, 7)}>7</div>
      <div class="square" on:pointerdown={(e) => addNumber(e, 8)}>8</div>
      <div class="square" on:pointerdown={(e) => addNumber(e, 9)}>9</div>
    </div>
  </div>
  <div class="buttons">
    <div class="row">
      <div on:pointerdown={deleteCellData}>Delete</div>
    </div>
    <div class="row">
      <div on:pointerdown={() => board.undo()}>Undo</div>
      <div on:pointerdown={() => board.redo()}>Redo</div>
    </div>
    {#if !$page.url.pathname.startsWith("/create")}
      <div class="row">
        <button
          class="smaller"
          tabindex="-1"
          disabled={$buttonState === "normal"}
          on:pointerdown={() => toggle("normal")}>Normal</button
        >
        <button
          class="smaller"
          tabindex="-1"
          disabled={$buttonState === "corner"}
          on:pointerdown={() => toggle("corner")}>Corner</button
        >
        <button
          class="smaller"
          tabindex="-1"
          disabled={$buttonState === "center"}
          on:pointerdown={() => toggle("center")}>Center</button
        >
      </div>
    {/if}
  </div>
</div>

<style>
  .outer {
    display: flex;
    flex-direction: column;
    background-color: var(--lighter);
    border-radius: 10px;
    border: 3px solid var(--main-color);
  }

  .outer > * {
    flex: 1;
  }

  .row {
    display: flex;
    flex-direction: row;
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
    padding: 1vw;
  }

  .row > div:not(.smaller),
  button {
    font-size: 2vw;
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
    font-size: 1vw;
  }

  @media only screen and (max-width: 768px) {
    .outer {
      display: flex;
      flex-direction: row;
      width: 70vw;
    }

    .buttons {
      display: flex;
      flex-direction: column;
    }

    .buttons > .row {
      flex: 1;
    }

    .row > div:not(.smaller),
    button {
      font-size: 5vw;
    }

    .numbers > .row > div {
      font-size: 6vw;
    }

    .smaller {
      font-size: 2.5vw;
    }
  }
</style>
