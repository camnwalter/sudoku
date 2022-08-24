import { NextPage } from "next";
import Board from "../components/Board";
import Buttons from "../components/Buttons";
import { Environment } from "../utils/utils";

const Create: NextPage = () => {
  return (
    <>
      <Board environment={Environment.Create} />
      <Buttons environment={Environment.Create} />
    </>
  );
};

export default Create;
