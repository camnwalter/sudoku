export const clickOutside = (node: Node) => {
  const handleClick = (event: MouseEvent) => {
    if (node && !node.contains(event.target as Element) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent("clickOutside"));
    }
  };

  document.addEventListener("mousedown", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("mousedown", handleClick, true);
    },
  };
};
