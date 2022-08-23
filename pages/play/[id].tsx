import useSwr from "swr";
import Board from "../../components/Board";
import Buttons from "../../components/Buttons";
import Header from "../../components/Header";
import { Environment } from "../../utils/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Id = () => {
  // const { data, error } = useSwr<string>(`/api/games`, fetcher);

  // if (error) return <div>Failed to load game</div>;
  // if (!data) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <Board /* initial={JSON.parse(data)} */ />
      <Buttons environment={Environment.Play} />
    </>
  );
};

export default Id;
