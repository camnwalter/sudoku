import { useEffect, useRef } from "react";

const useOutsideDetector = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // TODO: When pressing the buttons also don't reset the state.
      if (
        !ref.current?.children[0].contains(event.target as Element) &&
        !ref.current?.children[1].contains(event.target as Element)
      ) {
        callback();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [callback]);

  return ref;
};

export default useOutsideDetector;
