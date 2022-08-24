import { useRouter } from "next/router";
import useSwr from "swr";
import Board from "../../components/Board";
import Buttons from "../../components/Buttons";
import { Timer } from "../../components/Timer";
import styles from "../../styles/PlayId.module.css";
import { Environment } from "../../utils/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Id = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useSwr(`/api/games/${id}`, fetcher, {
    errorRetryCount: 0,
  });

  if (error !== undefined)
    return <div className={styles.error}>Failed to load game</div>;
  if (!data) return <div className={styles.error}>Loading...</div>;

  return (
    <>
      <Timer />
      <Board initial={data} environment={Environment.Play} />
      <Buttons environment={Environment.Play} />
    </>
  );
};

export default Id;
