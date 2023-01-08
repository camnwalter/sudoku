<script lang="ts">
  import { enhance } from "$app/forms";
  import Header from "$lib/components/Header.svelte";
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Sudoku" />
</svelte:head>

<Header />

<div class="pad" />

<form method="post" use:enhance>
  <button formaction="/?/createBoard" name="difficulty" value="easy"
    >Easy</button
  >
  <button formaction="/?/createBoard" name="difficulty" value="medium"
    >Medium</button
  >
  <button formaction="/?/createBoard" name="difficulty" value="hard"
    >Hard</button
  >
  <button formaction="/?/createBoard" name="difficulty" value="expert"
    >Expert</button
  >
</form>

<!-- TODO: tweak the home page functionality, numpad shift detection -->
<style>
  form {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  }

  button {
    width: 100%;
    font-size: 2.5rem;
    background-color: var(--lighter);
    border-radius: 10px;
    border: 3px solid var(--darkest);
    padding: 0.5rem 0;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--main-color);
  }
</style>
