<script lang="ts">
  import { board, started, timer, won } from "$lib/store";
  import Board from "$lib/components/Board.svelte";
  import type { ActionData, PageData } from "./$types";
  import { enhance } from "$app/forms";
  import Stopwatch from "$src/lib/components/Stopwatch.svelte";

  export let data: PageData;
  export let form: ActionData;

  if (!$started) {
    board.set(data.board);
    started.set(true);
  }

  const giveUp = () => {
    timer.set(0);
    started.set(false);
    board.reset();
    won.set(false);
  };
</script>

<Stopwatch />
<Board />
<form method="post" action="?/giveUp" use:enhance>
  <button on:click={giveUp} style="width: 40%; margin-top: 1rem">Give Up</button
  >
</form>

<style>
  form {
    display: flex;
    justify-content: center;
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
