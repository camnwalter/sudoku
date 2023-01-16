<script lang="ts">
  import { enhance } from "$app/forms";
  import { board } from "$lib/store";
</script>

<svelte:head>
  <title>Create</title>
  <meta name="description" content="Create a new sudoku game" />
</svelte:head>

<form method="post" action="?/createCustomBoard" use:enhance>
  <div class="pad" />
  <button
    style="width: 40%"
    tabindex="-1"
    name="board"
    value={$board.map(({ number }) => number || "-").join("")}
    >Create Board</button
  >
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  button {
    font-size: 2vw;
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
