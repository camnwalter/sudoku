import { NextPage } from "next";
import Board from "../../components/Board";
import Buttons from "../../components/Buttons";
import { Timer } from "../../components/Timer";
import { Environment } from "../../utils/utils";

const Play: NextPage = () => {
  return (
    <div>
      <Timer />
      <Board environment={Environment.Basic} />
      <Buttons environment={Environment.Basic} />
    </div>
  );
};

export default Play;
