import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import useSwr from "swr";
import Board from "../../components/Board";
import Buttons from "../../components/Buttons";
import { Timer } from "../../components/Timer";
import styles from "../../styles/PlayId.module.css";
import { Game } from "../../utils/types";
import { Environment } from "../../utils/utils";

interface BadUrl {
  message: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Id = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useSwr<Game | BadUrl>(`/api/games/${id}`, fetcher);

  if (data === undefined) {
    return <div className={styles.error}>Loading...</div>;
  }

  if ((data as BadUrl).message !== undefined) {
    return <div className={styles.error}>{(data as BadUrl).message}</div>;
  }

  const cellData = (data as Game).board.map((cell) => ({
    number: cell,
    corners: [],
    centers: [],
    locked: cell !== null,
  }));

  return (
    <>
      <Timer />
      <Board initial={cellData} environment={Environment.Play} />
      <Buttons environment={Environment.Play} />
    </>
  );
};

export default Id;
