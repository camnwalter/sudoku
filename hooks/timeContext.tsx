import { createContext, ReactNode, useContext, useState } from "react";

interface TimeContextProps {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  formatTime: () => string;
}

const TimeContext = createContext<TimeContextProps>({
  time: 0,
  setTime: () => undefined,
  formatTime: () => "",
});

interface TimeProviderProps {
  children: ReactNode;
}

export const TimeProvider = ({ children }: TimeProviderProps) => {
  const [time, setTime] = useState(0);

  const formatTime = () => {
    let seconds = Math.floor(time / 1000);
    const mins = Math.floor(seconds / 60);
    if (seconds >= 60) {
      seconds -= 60 * mins;
    }
    return `${`${mins}`.padStart(2, "0")}:${`${seconds}`.padStart(2, "0")}`;
  };

  return (
    <TimeContext.Provider
      value={{
        time,
        setTime,
        formatTime,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => useContext(TimeContext);
