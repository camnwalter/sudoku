<script lang="ts">
  import { board } from "$lib/store";
  import SideButtons from "./SideButtons.svelte";

  let remainingNumbers: number[];

  $: {
    const numberFrequencies = Array<number>(9).fill(0);
    $board.forEach(({ number }) => {
      if (number !== 0) {
        numberFrequencies[number - 1]++;
      }
    });

    remainingNumbers = Object.entries(numberFrequencies).reduce<number[]>(
      (acc, [index, freq]) => {
        const indexNum = parseInt(index);
        if (freq < 9) {
          acc.push(indexNum + 1);
        }
        return acc;
      },
      []
    );
  }
</script>

<div class="wrapper">
  <div>
    <div>Remaining Numbers</div>
    {#if remainingNumbers.length > 0}
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
    user-select: none;
  }

  .remainingNumbers {
    font-size: 1.5rem;
    background-color: var(--darkest);
    color: white;
    border-radius: 10px;
    padding-inline: 10px;
    margin-top: 1rem;
  }
</style>
