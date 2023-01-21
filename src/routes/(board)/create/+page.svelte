<script lang="ts">
  import { enhance } from "$app/forms";
  import { board } from "$lib/store";
</script>

<svelte:head>
  <title>Create</title>
  <meta name="description" content="Create a new sudoku game" />
</svelte:head>

<div class="pad" />

<form method="post" action="?/createCustomBoard" use:enhance>
  <button
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

  form > * {
    background-color: var(--main-color);
    margin-inline: 0.5vw;
    padding: 0.5vw 1vw;
    border-radius: 0.5vw;
    border: 0.25vw solid var(--darkest);
    user-select: none;
    cursor: pointer;
    font-size: 2vw;
    color: white;
  }

  form > *:hover {
    background-color: var(--lighter);
  }

  @media only screen and (max-width: 768px) {
    form > * {
      font-size: 6vw;
      margin-inline: 1vw;
      padding: 1vw 2vw;
      border-radius: 1vw;
      border: 0.5vw solid var(--darkest);
    }
  }
</style>
