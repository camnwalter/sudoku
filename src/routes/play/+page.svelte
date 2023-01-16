<script lang="ts">
  import { enhance } from "$app/forms";
</script>

<svelte:head>
  <title>Play</title>
  <meta name="description" content="Sudoku game" />
</svelte:head>

<form method="post" use:enhance>
  Play a custom difficulty:
  <button name="difficulty" value="easy">Easy</button>
  <button name="difficulty" value="medium">Medium</button>
  <button name="difficulty" value="hard">Hard</button>
  <button name="difficulty" value="expert">Expert</button>
  <div class="pad" />
  <div>
    Or enter game code: <input type="text" name="code" /><button class="smaller"
      >Submit</button
    >
  </div>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 2vw;
    height: 100vh;
  }

  input {
    border: 1px solid black;
  }

  button {
    width: 40%;
    font-size: 2.5vw;
    background-color: var(--lighter);
    border-radius: 10px;
    border: 3px solid var(--darkest);
    padding: 0.5vw 0;
    color: white;
    cursor: pointer;
  }

  .smaller {
    width: fit-content;
    font-size: 2vw;
    margin: 0.5vw;
    padding: 0.5vw;
  }

  button:hover {
    background-color: var(--main-color);
  }

  @media only screen and (max-width: 768px) {
    form {
      font-size: 4vw;
    }

    button {
      width: 80%;
      font-size: 5vw;
    }

    .smaller {
      font-size: 4vw;
    }
  }
</style>
