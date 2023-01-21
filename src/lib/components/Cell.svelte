<script lang="ts">
  import { addNumber } from "$lib/addNumber";
  import { arrowKeyFocus } from "$lib/focus";
  import {
    board,
    mouseState,
    resetCellIfPossible,
    selectedCells,
    selectedNumbers,
  } from "$lib/store";

  export let boardRef: HTMLDivElement;
  export let index: number;
  $: number = $board[index].number ?? 0;

  const onMouseDown = (event: PointerEvent) => {
    mouseState.set(true);
    selectedCells.update((prev) => {
      if (!event.ctrlKey) {
        prev.fill(false);
      }
      prev[index] = true;
      return prev;
    });

    selectedNumbers.update((prev) =>
      event.ctrlKey ? prev.concat(number) : [number]
    );
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
      selectedNumbers.update((cells) => cells.concat(number));
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

  const isShiftDown = (event: KeyboardEvent) => {
    return (
      event.shiftKey ||
      (event.code.startsWith("Numpad") &&
        (event.key.startsWith("Arrow") ||
          event.key === "Home" ||
          event.key === "End" ||
          event.key === "Clear" ||
          event.key.startsWith("Page")))
    );
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if ($board[index].locked) return;

    const key = parseInt(event.code.slice(-1));

    if (1 <= key && key <= 9) {
      addNumber(event, key, isShiftDown(event));
    } else if (event.code === "Backspace") {
      board.update((cells) => {
        $selectedCells.forEach((cell, i) => {
          if (!cell) return;

          cells[i] = resetCellIfPossible(cells[i]);
        });
        return cells;
      });
      selectedNumbers.set([]);
    } else if (event.ctrlKey) {
      if (event.code === "KeyZ") board.undo();
      if (event.code === "KeyY") board.redo();
    }
  };

  const onTouchMove = (event: TouchEvent) => {
    const grid = boardRef?.getBoundingClientRect();

    if (!grid) return;

    const { clientX, clientY } = event.changedTouches[0];

    const dx = clientX - grid.left;
    const dy = clientY - grid.top;

    const row = Math.floor((dy / grid.height) * 9);
    const col = Math.floor((dx / grid.width) * 9);

    if (row >= 0 && row < 9 && col >= 0 && col < 9) {
      selectedCells.update((cells) => {
        cells[row * 9 + col] = true;
        return cells;
      });
      selectedNumbers.update((cells) => cells.concat(number));
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
  class:sameNumber={number !== 0 && $selectedNumbers.includes(number)}
  class:adjacent={isAdjacent($selectedCells)}
  class:locked={$board[index].locked}
  on:pointerenter={onMouseEnter}
  on:pointerdown={onMouseDown}
  on:pointerup={onMouseUp}
  on:keydown|preventDefault={onKeyDown}
  on:touchmove|preventDefault|stopPropagation={onTouchMove}
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
    font-size: 3vw;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    outline: none;
    background-color: white;
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
    font-size: 1vw;
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
    font-size: 1vw;
    max-width: 100%;
    word-wrap: break-word;
    text-align: center;
  }

  @media only screen and (max-width: 768px) {
    .cell {
      width: 9.5vw;
      font-size: 8vw;
    }

    .corners,
    .centers {
      font-size: 2.5vw;
    }
  }
</style>
