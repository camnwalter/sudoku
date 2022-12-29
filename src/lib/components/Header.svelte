<header>
  <ul>
    <li>
      <a href="/">Home</a>
    </li>
    <li>
      <a href="/create">Create</a>
    </li>
  </ul>
</header>

<style>
  ul {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    list-style: none;
    background-color: var(--main-color);
  }

  li {
    position: relative;
    height: 100%;
    width: 100%;
    border-radius: 10px;
    text-align: center;
    padding: 5px;
  }

  li:hover {
    background-color: var(--lighter);
  }

  a {
    font-size: 1.5rem;
    text-decoration: none;
    color: white;
  }
</style>
