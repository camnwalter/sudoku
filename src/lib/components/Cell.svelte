<script lang="ts">
  import {
    board,
    mouseState,
    selectedCells,
    selectedNumbers,
  } from "$lib/store";

  export let index: number;
  $: number = $board[index]?.number ?? 0;

  const onMouseDown = () => {
    mouseState.set(true);
    selectedCells.update(() => {
      const newCells = Array(81).fill(false);
      newCells[index] = true;
      return newCells;
    });
    selectedNumbers.update(() => {
      if (number !== 0) return [number];
      return [];
    });
  };

  const onMouseUp = () => {
    mouseState.set(false);
  };

  const onMouseEnter = () => {
    if ($mouseState) {
      selectedCells.update((cells) => {
        cells[index] = true;
        return cells;
      });
      if (number !== 0) {
        selectedNumbers.update((cells) => cells.concat(number));
      }
    }
  };

  $: isAdjacent = (selected: boolean[]) => {
    return selected.some((cell, i) => {
      return (
        cell &&
        (index % 9 === i % 9 || Math.floor(index / 9) === Math.floor(i / 9))
      );
    });
  };

  const addNumber = (event: KeyboardEvent, num: number) => {
    if (event.ctrlKey) {
    } else if (event.shiftKey) {
    } else {
      board.update((cells) => {
        cells[index].number = num;
        return cells;
      });
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if ($board[index].locked) return;

    const key = parseInt(event.code.substring("Digit".length));

    if (1 <= key && key <= 9) {
      addNumber(event, key);
    }

    if (event.code === "Backspace") {
      board.update((cells) => {
        cells[index].number = 0;
        return cells;
      });
    }
  };
</script>

<div
  class="cell"
  class:left={index % 3 === 0}
  class:right={index % 3 === 2}
  class:up={Math.floor(index / 9) % 3 === 0}
  class:down={Math.floor(index / 9) % 3 === 2}
  class:selected={$selectedCells[index]}
  class:sameNumber={$selectedNumbers.includes(number)}
  class:adjacent={isAdjacent($selectedCells)}
  class:locked={$board[index]?.locked}
  on:mouseenter={onMouseEnter}
  on:mousedown={onMouseDown}
  on:mouseup={onMouseUp}
  on:keydown|preventDefault={onKeyDown}
  tabindex="-1"
>
  {#if number !== 0}
    {number}
  {/if}
</div>

<style>
  .cell {
    width: 3.5vw;
    aspect-ratio: 1 / 1;
    font-size: 3.5rem;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }

  .adjacent {
    background-color: var(--lightest);
  }

  .sameNumber {
    background-color: var(--lighter);
  }

  .selected {
    background-color: var(--main-color);
  }

  .left {
    border-left: 3px solid black;
  }

  .right {
    border-right: 3px solid black;
  }
  .up {
    border-top: 3px solid black;
  }

  .down {
    border-bottom: 3px solid black;
  }

  .locked {
    color: blue;
  }
</style>
