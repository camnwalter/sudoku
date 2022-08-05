import { useEffect } from "react";

// todo: seems to stop incrementing whenever a key is pressed.?
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
  }, [winner]);
};
