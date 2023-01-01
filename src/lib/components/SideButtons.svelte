<script lang="ts">
  import { addNumber } from "$lib/addNumber";
</script>

<div class="sideButtons">
  <div class="row">
    <div on:mousedown={(e) => addNumber(e, 1)}>1</div>
    <div on:mousedown={(e) => addNumber(e, 2)}>2</div>
    <div on:mousedown={(e) => addNumber(e, 3)}>3</div>
  </div>
  <div class="row">
    <div on:mousedown={(e) => addNumber(e, 4)}>4</div>
    <div on:mousedown={(e) => addNumber(e, 5)}>5</div>
    <div on:mousedown={(e) => addNumber(e, 6)}>6</div>
  </div>
  <div class="row">
    <div on:mousedown={(e) => addNumber(e, 7)}>7</div>
    <div on:mousedown={(e) => addNumber(e, 8)}>8</div>
    <div on:mousedown={(e) => addNumber(e, 9)}>9</div>
  </div>
</div>

<style>
  .sideButtons {
    margin-top: 1rem;
    background-color: var(--lighter);
    border-radius: 10px;
    border: 3px solid var(--main-color);
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .row > div {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    aspect-ratio: 1 / 1;
    width: 100%;
    color: white;
    border: 1px solid var(--main-color);
    cursor: pointer;
    user-select: none;
  }
</style>
