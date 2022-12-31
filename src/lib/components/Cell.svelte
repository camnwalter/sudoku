<script lang="ts">
  import { arrowKeyFocus } from "$lib/focus";
  import {
    board,
    mouseState,
    selectedCells,
    selectedNumbers,
  } from "$lib/store";

  export let index: number;
  $: number = $board[index].number ?? 0;

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
      const row = Math.floor(index / 9);
      const col = index % 9;
      const otherRow = Math.floor(i / 9);
      const otherCol = i % 9;

      const sameRow = row === otherRow;
      const sameCol = col === otherCol;
      const same3x3 =
        Math.floor(row / 3) === Math.floor(otherRow / 3) &&
        Math.floor(col / 3) === Math.floor(otherCol / 3);

      return cell && (sameRow || sameCol || same3x3);
    });
  };

  const addOrRemoveExisting = (arr: number[], num: number) => {
    if (arr.includes(num)) {
      arr[num - 1] = 0;
    } else {
      arr[num - 1] = num;
    }

    return arr;
  };

  const addNumber = (event: KeyboardEvent, num: number) => {
    if (event.ctrlKey) {
      board.update((cells) => {
        $selectedCells.forEach((cell, i) => {
          if (!cell) return;

          cells[i] = {
            ...cells[i],
            corners: addOrRemoveExisting(cells[i].corners, num),
          };
        });

        return cells;
      });
    } else if (event.shiftKey) {
      board.update((cells) => {
        $selectedCells.forEach((cell, i) => {
          if (!cell) return;

          cells[i] = {
            ...cells[i],
            centers: addOrRemoveExisting(cells[i].centers, num),
          };
        });

        return cells;
      });
    } else {
      board.update((cells) => {
        $selectedCells.forEach((cell, i) => {
          if (!cell) return;

          cells[i].number = num;
        });

        return cells;
      });
      selectedNumbers.set([num]);
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
        $selectedCells.forEach((cell, i) => {
          if (!cell) return;

          cells[i] = {
            number: 0,
            locked: false,
            corners: Array(9).fill(0),
            centers: Array(9).fill(0),
          };
        });
        return cells;
      });
      selectedNumbers.set([]);
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
  class:locked={$board[index].locked}
  on:mouseenter={onMouseEnter}
  on:mousedown={onMouseDown}
  on:mouseup={onMouseUp}
  on:keydown|preventDefault={onKeyDown}
  tabindex="-1"
  use:arrowKeyFocus={index}
>
  {#if number !== 0}
    {number}
  {:else}
    {#if $board[index].corners?.filter((n) => n !== 0).length > 0}
      {@const corners = $board[index].corners}
      <div class="corners">
        <div class="row">
          <div class="corner">{corners[0] || ""}</div>
          <div class="corner">{corners[1] || ""}</div>
          <div class="corner">{corners[2] || ""}</div>
        </div>
        <div class="row">
          <div class="corner">{corners[3] || ""}</div>
          <div class="corner">{corners[4] || ""}</div>
          <div class="corner">{corners[5] || ""}</div>
        </div>
        <div class="row">
          <div class="corner">{corners[6] || ""}</div>
          <div class="corner">{corners[7] || ""}</div>
          <div class="corner">{corners[8] || ""}</div>
        </div>
      </div>
    {/if}
    <div class="centers">
      {$board[index].centers?.filter((n) => n !== 0)?.join("") ?? ""}
    </div>
  {/if}
</div>

<style>
  .cell {
    position: relative;
    width: 3.5vw;
    aspect-ratio: 1 / 1;
    font-size: 3.5rem;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    outline: none;
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

  .corners {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    font-size: 1rem;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .corner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .centers {
    position: absolute;
    font-size: 1rem;
    max-width: 100%;
    word-wrap: break-word;
    text-align: center;
  }
</style>
