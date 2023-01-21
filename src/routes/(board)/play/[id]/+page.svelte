<script lang="ts">
  import { enhance } from "$app/forms";
  import { isValidSolution } from "$lib/isValidSolution";
  import { board, started, won } from "$lib/store";
  import toast from "svelte-french-toast";
  import type { PageData } from "./$types";

  export let data: PageData;

  if (!$started) {
    board.set(data.board);
    started.set(true);
  }

  const checkBoard = (puzzle: Cell[]) => {
    if (isValidSolution(puzzle)) {
      won.set(true);
      toast.success("Congratulations, you won!", {
        style: "font-size: 1.5rem",
      });
    }
  };
</script>

<svelte:head>
  <title>Play</title>
  <meta name="description" content="Sudoku game" />
</svelte:head>

<div class="pad" />

<div class="wrapper">
  <form method="post" action="?/giveUp" use:enhance>
    {#if !$won}
      <div on:pointerdown={() => board.reset()}>Reset</div>
      <div on:pointerdown={() => checkBoard($board)}>Check</div>
    {/if}

    <button tabindex="-1">
      {#if $won}
        Go Back
      {:else}
        Give Up
      {/if}
    </button>
  </form>
</div>

<style>
  .wrapper {
    display: flex;
    justify-content: center;
  }

  form {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
  }

  form > * {
    background-color: var(--main-color);
    margin-inline: 0.5vw;
    padding: 0.5vw 1vw;
    border-radius: 0.5vw;
    border: 0.25vw solid var(--darkest);
    user-select: none;
    cursor: pointer;
    font-size: 2vw;
    color: white;
  }

  form > *:hover {
    background-color: var(--lighter);
  }

  @media only screen and (max-width: 768px) {
    form > * {
      font-size: 6vw;
      margin-inline: 1vw;
      padding: 1vw 2vw;
      border-radius: 1vw;
      border: 0.5vw solid var(--darkest);
    }
  }
</style>
