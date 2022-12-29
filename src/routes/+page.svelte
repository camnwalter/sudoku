<script lang="ts">
  import Board from "$lib/components/Board.svelte";
  import type { Difficulty } from "sudoku-gen/dist/types/difficulty.type";
  import { getSudoku } from "sudoku-gen";
  import { board } from "$lib/store";

  const generateBoard = (difficulty: Difficulty) => {
    const { puzzle } = getSudoku(difficulty);
    board.update((cells) => {
      [...puzzle].forEach((char, i) => {
        const num = parseInt(char);
        cells[i] = {
          number: num || 0,
          locked: !Number.isNaN(num),
        };
      });
      return cells;
    });
  };
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Sudoku" />
</svelte:head>

<Board />

<div>
  <button on:click={() => generateBoard("easy")}>Easy</button>
  <button on:click={() => generateBoard("medium")}>Medium</button>
  <button on:click={() => generateBoard("hard")}>Hard</button>
  <button on:click={() => generateBoard("expert")}>Expert</button>
</div>
