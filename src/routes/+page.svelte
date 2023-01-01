<script lang="ts">
  import Board from "$lib/components/Board.svelte";
  import Stopwatch from "$lib/components/Stopwatch.svelte";
  import { board, started, timer } from "$lib/store";
  import { getSudoku } from "sudoku-gen";
  import type { Difficulty } from "sudoku-gen/dist/types/difficulty.type";

  const generateBoard = (difficulty: Difficulty) => {
    const { puzzle } = getSudoku(difficulty);
    board.update((cells) => {
      [...puzzle].forEach((char, i) => {
        const num = parseInt(char);
        cells[i] = {
          number: num || 0,
          locked: !Number.isNaN(num),
          corners: [],
          centers: [],
        };
      });
      return cells;
    });
    started.set(true);
    timer.set(0);
  };

  const giveUp = () => {
    timer.set(0);
    started.set(false);
  };
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Sudoku" />
</svelte:head>

{#if $started}
  <Stopwatch />
  <Board />
{/if}

<div>
  {#if !$started}
    <button on:click={() => generateBoard("easy")}>Easy</button>
    <button on:click={() => generateBoard("medium")}>Medium</button>
    <button on:click={() => generateBoard("hard")}>Hard</button>
    <button on:click={() => generateBoard("expert")}>Expert</button>
  {:else}
    <button on:click={giveUp} style="width: 40%; margin-top: 1rem"
      >Give Up</button
    >
  {/if}
</div>

<style>
  div {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  button {
    width: 100%;
    font-size: 2.5rem;
    background-color: var(--lighter);
    border-radius: 10px;
    border: 3px solid var(--darkest);
    padding: 0.5rem 0;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--main-color);
  }
</style>
