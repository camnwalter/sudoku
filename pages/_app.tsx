import type { AppProps } from "next/app";
import Head from "next/head";
import Header from "../components/Header";
import { SudokuProvider } from "../hooks/sudokuContext";
import { TimeProvider } from "../hooks/timeContext";
import { UndoRedoProvider } from "../hooks/undoRedoContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Sudoku</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SudokuProvider>
        <UndoRedoProvider>
          <TimeProvider>
            <Header />
            <Component {...pageProps} />
          </TimeProvider>
        </UndoRedoProvider>
      </SudokuProvider>
    </>
  );
}

export default MyApp;
