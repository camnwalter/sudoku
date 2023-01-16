<script>
  import { goto } from "$app/navigation";
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Sudoku" />
</svelte:head>

<div>
  <button on:click={() => goto("/play")}>Play</button>
  <button on:click={() => goto("/create")}>Create</button>
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100vh;
  }

  button {
    width: 100%;
    background-color: var(--main-color);
    color: white;
    font-size: 4vmax;
    user-select: none;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--lighter);
  }
</style>
