import { useEffect, useState } from "react";

export const Timer = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const tick = () => setTime(time + 1000);

    const interval = setInterval(tick, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  const formatTime = () => {
    const diff = time;
    let seconds = Math.floor(diff / 1000);
    const mins = Math.floor(seconds / 60);
    if (seconds >= 60) {
      seconds -= 60 * mins;
    }
    return `${`${mins}`.padStart(2, "0")}:${`${seconds}`.padStart(2, "0")}`;
  };

  return <div>{formatTime()}</div>;
};
