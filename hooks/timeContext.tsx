import { createContext, ReactNode, useContext, useState } from "react";

interface TimeContextProps {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
}

const TimeContext = createContext<TimeContextProps>({
  time: 0,
  setTime: () => undefined,
});

interface TimeProviderProps {
  children: ReactNode;
}

export const TimeProvider = ({ children }: TimeProviderProps) => {
  const [time, setTime] = useState(0);

  return (
    <TimeContext.Provider
      value={{
        time,
        setTime,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => useContext(TimeContext);
