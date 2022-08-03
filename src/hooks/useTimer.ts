import { useEffect } from "react";

export const useTimer = (winner: boolean, callback: () => void) => {
  useEffect(() => {
    let interval: NodeJS.Timer | undefined;
    if (!winner) {
      interval = setInterval(callback, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);
};
