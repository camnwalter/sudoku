<script lang="ts">
  import { timer, started, won } from "$lib/store";
  import { onMount } from "svelte";

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  onMount(() => {
    const interval = setInterval(() => {
      if ($started && !$won) {
        timer.update((time) => time + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  });
</script>

<div class="wrapper">
  <div class="stopwatch">{formatTime($timer)}</div>
</div>

<style>
  .wrapper {
    display: flex;
    justify-content: center;
  }

  .stopwatch {
    font-size: 1.5vw;
    background-color: var(--lighter);
    padding: 0.5vw 1vw;
    border-radius: 1vw;
    color: white;
    border: 0.2vw solid var(--darkest);
    user-select: none;
  }

  @media only screen and (max-width: 768px) {
    .stopwatch {
      font-size: 4vw;
      padding: 1vw 2vw;
      border-radius: 2vw;
      border: 0.5vw solid var(--darkest);
    }
  }
</style>
