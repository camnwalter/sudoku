<script lang="ts">
  import { timer, started } from "$lib/store";
  import { onMount } from "svelte";

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  onMount(() => {
    const interval = setInterval(() => {
      if ($started) {
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
    font-size: 1.5rem;
    background-color: var(--lighter);
    padding: 0.5rem 1rem;
    border-radius: 10px;
    color: white;
    margin-bottom: 1rem;
    border: 2px solid var(--darkest);
    user-select: none;
  }
</style>
