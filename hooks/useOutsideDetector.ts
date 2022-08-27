import { useEffect, useRef } from "react";

const useOutsideDetector = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        ![...(ref.current?.children ?? [])].some((child) =>
          child.contains(target)
        ) &&
        ![...(ref.current?.parentElement?.lastChild?.childNodes ?? [])].some(
          (child) => child.contains(target)
        )
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
