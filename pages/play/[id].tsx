import { GetServerSideProps } from "next";
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

interface IdProps {
  params: ParsedUrlQuery;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Id = ({ params }: IdProps) => {
  const { id } = params;

  const { data } = useSwr<Game | BadUrl>(`/api/games/${id as string}`, fetcher);

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Sets the parameters at request time so the params are never undefined
  return {
    props: { params: context.params },
  };
};

export default Id;
