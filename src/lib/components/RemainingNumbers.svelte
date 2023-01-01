<script lang="ts">
  import { board } from "$lib/store";
  import SideButtons from "./SideButtons.svelte";

  let remainingNumbers: number[];

  $: {
    const numberFrequencies = $board
      .map(({ number }) => number)
      .reduce<Record<string, number>>((acc, curr) => {
        acc[curr] ? ++acc[curr] : (acc[curr] = 1);
        return acc;
      }, {});

    remainingNumbers = Object.entries(numberFrequencies).reduce<number[]>(
      (acc, [num, freq]) => {
        if (freq < 9) {
          acc.push(parseInt(num));
        }
        return acc;
      },
      []
    );
  }
</script>

<div class="wrapper">
  <div>
    {#if remainingNumbers.length > 0}
      <div>Remaining Numbers</div>
      <div class="remainingNumbers">{remainingNumbers.join(" ")}</div>
    {/if}
  </div>
  <SideButtons />
</div>

<style>
  .wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .wrapper > div {
    text-align: center;
    font-size: 1.5rem;
    background-color: var(--lightest);
    padding: 5px;
    border-radius: 10px;
    border: 3px solid var(--lighter);
  }

  .remainingNumbers {
    font-size: 1.5rem;
    background-color: var(--darkest);
    color: white;
    border-radius: 10px;
    padding-inline: 10px;
    margin-top: 1rem;
    user-select: none;
    cursor: pointer;
  }
</style>
