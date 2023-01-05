<script lang="ts">
  import { enhance } from "$app/forms";
  import Board from "$lib/components/Board.svelte";
  import Stopwatch from "$lib/components/Stopwatch.svelte";
  import { board, started, timer, won } from "$lib/store";
  import type { ActionData } from "./$types";

  export let form: ActionData;

  $: if (form != null) {
    if ("board" in form) {
      board.set(form.board);
      started.set(true);
      timer.set(0);
    } else if (form.success) {
      won.set(true);
    }
  }

  const giveUp = () => {
    timer.set(0);
    started.set(false);
    board.reset();
    won.set(false);
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
    <form method="post" use:enhance>
      <button formaction="/?/createBoard" name="difficulty" value="easy"
        >Easy</button
      >
      <button formaction="/?/createBoard" name="difficulty" value="medium"
        >Medium</button
      >
      <button formaction="/?/createBoard" name="difficulty" value="hard"
        >Hard</button
      >
      <button formaction="/?/createBoard" name="difficulty" value="expert"
        >Expert</button
      >
    </form>
  {:else}
    <button on:click={giveUp} style="width: 40%; margin-top: 1rem"
      >Give Up</button
    >
  {/if}
</div>

<style>
  form,
  div {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
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
