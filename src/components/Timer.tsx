interface Props {
  time: number;
}

export const Timer = ({ time }: Props) => {
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
