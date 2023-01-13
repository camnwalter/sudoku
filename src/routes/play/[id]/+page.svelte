<script lang="ts">
  import { enhance } from "$app/forms";
  import { board, started, timer, won } from "$lib/store";
  import type { PageData } from "./$types";

  export let data: PageData;

  if (!$started) {
    board.set(data.board);
    started.set(true);
  }

  const giveUp = () => {
    timer.set(0);
    started.set(false);
    won.set(false);
  };
</script>

<svelte:head>
  <title>Play</title>
  <meta name="description" content="Sudoku game" />
</svelte:head>

<form method="post" action="?/giveUp" use:enhance>
  <div class="pad" />
  <button on:click={giveUp} style="width: 40%" tabindex="-1">Give Up</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  button {
    font-size: 2rem;
    background-color: var(--main-color);
    color: white;
    border-radius: 5px;
    border: 3px solid var(--darkest);
    user-select: none;
    cursor: pointer;
    padding: 5px;
  }

  button:hover {
    background-color: var(--lighter);
  }
</style>
