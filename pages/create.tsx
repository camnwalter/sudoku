import { NextPage } from "next";
import Board from "../components/Board";
import Buttons from "../components/Buttons";
import Header from "../components/Header";
import { Environment } from "../utils/utils";

const Create: NextPage = () => {
  return (
    <>
      <Header />
      <Board />
      <Buttons environment={Environment.Create} />
    </>
  );
};

export default Create;
