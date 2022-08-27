import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import useSwr from "swr";
import Board from "../../components/Board";
import Buttons from "../../components/Buttons";
import { Timer } from "../../components/Timer";
import styles from "../../styles/PlayId.module.css";
import { CellData } from "../../utils/types";
import { Environment } from "../../utils/utils";

interface IdProps {
  params: ParsedUrlQuery;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Id = ({ params }: IdProps) => {
  const { id } = params;

  const { data } = useSwr<CellData[] | Record<string, string>>(
    `/api/games/${id as string}`,
    fetcher
  );

  if (data === undefined) {
    return <div className={styles.error}>Loading...</div>;
  }

  if (!Array.isArray(data)) {
    return <div className={styles.error}>{data.message}</div>;
  }

  return (
    <>
      <Timer />
      <Board initial={data} environment={Environment.Play} />
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
