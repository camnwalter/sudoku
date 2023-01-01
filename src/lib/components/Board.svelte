<script lang="ts">
  import { selectedCells, selectedNumbers } from "$lib/store";
  import Cell from "./Cell.svelte";
  import RemainingNumbers from "./RemainingNumbers.svelte";

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

<div class="wrapper" use:clearSelected>
  <div class="board">
    {#each Array(9) as _, row}
      <div class="row">
        {#each Array(9) as _, col}
          {@const index = row * 9 + col}
          <Cell {index} />
        {/each}
      </div>
    {/each}
  </div>
  <RemainingNumbers />
</div>

<style>
  .wrapper {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
  }

  .board {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
  }
</style>
