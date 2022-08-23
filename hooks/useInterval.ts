import { useEffect, useRef } from "react";

/**
 *
 * @param condition when true, callback loops
 * @param callback
 */
export const useInterval = (condition: boolean, callback: () => void) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    let id: NodeJS.Timer | undefined;
    if (condition) {
      id = setInterval(tick, 1000);
    }
    return () => clearInterval(id);
  }, [condition]);
};
