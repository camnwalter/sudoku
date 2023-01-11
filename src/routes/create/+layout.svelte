<script lang="ts">
  import Board from "$lib/components/Board.svelte";
  import SideButtons from "$lib/components/SideButtons.svelte";
  import { selectedCells, selectedNumbers } from "$lib/store";

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

<div use:clearSelected>
  <Board />
  <div class="pad" />
  <div class="pad" />
  <SideButtons />
</div>

<slot />
