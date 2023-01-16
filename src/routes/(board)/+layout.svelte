<script lang="ts">
  import { page } from "$app/stores";
  import Board from "$lib/components/Board.svelte";
  import SideButtons from "$lib/components/SideButtons.svelte";
  import Stopwatch from "$lib/components/Stopwatch.svelte";
  import { selectedCells, selectedNumbers } from "$lib/store";

  const clearSelected = (node: Node) => {
    const handleMouseDown = (event: MouseEvent) => {
      if (node === event.target || !node.contains(event.target as Element)) {
        selectedCells.set(Array(81).fill(false));
        selectedNumbers.set([]);
      }
    };

    document.addEventListener("pointerdown", handleMouseDown, true);

    return {
      destroy() {
        document.removeEventListener("pointerdown", handleMouseDown, true);
      },
    };
  };
</script>

<div class="wrapper">
  {#if !$page.url.pathname.startsWith("/create")}
    <div class="pad" />
    <Stopwatch />
    <div class="pad" />
  {/if}

  <div class="gameArea" use:clearSelected>
    <Board />
    <div class="pad" />
    <div class="pad" />
    <SideButtons />
  </div>
  <slot />
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .pad {
    margin: 0.5vw;
  }

  .gameArea {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media only screen and (max-width: 768px) {
    .gameArea {
      flex-direction: column;
    }
  }
</style>
