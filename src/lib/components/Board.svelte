<script lang="ts">
  import Cell from "./Cell.svelte";

  let boardRef: HTMLDivElement;

  $: board = boardRef;
</script>

<div class="board" bind:this={boardRef}>
  {#each Array(9) as _, row}
    <div class="row">
      {#each Array(9) as _, col}
        {@const index = row * 9 + col}
        <Cell {index} boardRef={board} />
      {/each}
    </div>
  {/each}
</div>

<style>
  .board {
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    flex-direction: row;
  }
</style>
