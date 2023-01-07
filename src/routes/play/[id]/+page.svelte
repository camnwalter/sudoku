<script lang="ts">
  import {
    board,
    selectedCells,
    selectedNumbers,
    started,
    timer,
    won,
  } from "$lib/store";
  import Board from "$lib/components/Board.svelte";
  import type { ActionData, PageData } from "./$types";
  import { enhance } from "$app/forms";
  import Stopwatch from "$src/lib/components/Stopwatch.svelte";
  import SideButtons from "$src/lib/components/SideButtons.svelte";

  export let data: PageData;
  export let form: ActionData;

  if (!$started) {
    board.set(data.board);
    started.set(true);
  }

  $: if (form?.success) {
    won.set(true);
  }

  const giveUp = () => {
    timer.set(0);
    started.set(false);
    won.set(false);
  };

  const clearSelected = (node: Node) => {
    const handleMouseDown = (event: MouseEvent) => {
      if (node === event.target || !node.contains(event.target as Element)) {
        selectedCells.set(Array(81).fill(false));
        selectedNumbers.set([]);
      }
    };

    document.addEventListener("mousedown", handleMouseDown, true);

    return {
      destroy() {
        document.removeEventListener("mousedown", handleMouseDown, true);
      },
    };
  };
</script>

<Stopwatch />
<div class="pad" />
<div class="wrapper" use:clearSelected>
  <Board />
  <div class="pad" />
  <div class="pad" />
  <SideButtons />
</div>

<form method="post" action="?/giveUp" use:enhance>
  <div class="pad" />
  <button on:click={giveUp} style="width: 40%">Give Up</button>
</form>

<style>
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

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
