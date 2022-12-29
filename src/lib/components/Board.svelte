<script lang="ts">
  import { clickOutside } from "$lib/clickOutside";
  import { selectedCells, selectedNumbers } from "$lib/store";
  import Cell from "./Cell.svelte";

  const handleClickOutside = () => {
    selectedCells.set([]);
    selectedNumbers.set([]);
  };
</script>

<div class="wrapper">
  <div class="board" use:clickOutside on:clickOutside={handleClickOutside}>
    {#each Array(9) as _, row}
      <div class="row">
        {#each Array(9) as _, col}
          {@const index = row * 9 + col}
          <Cell {index} />
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    justify-content: center;
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
