import { NextPage } from "next";
import Board from "../../components/Board";
import Buttons from "../../components/Buttons";
import Header from "../../components/Header";
import { Timer } from "../../components/Timer";
import { Environment } from "../../utils/utils";

const Play: NextPage = () => {
  return (
    <div>
      <Header />
      <Timer />
      <Board />
      <Buttons environment={Environment.Basic} />
    </div>
  );
};

export default Play;
