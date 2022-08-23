import type { AppProps } from "next/app";
import { SudokuProvider } from "../hooks/sudokuContext";
import { TimeProvider } from "../hooks/timeContext";
import { UndoRedoProvider } from "../hooks/undoRedoContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SudokuProvider>
      <UndoRedoProvider>
        <TimeProvider>
          <Component {...pageProps} />
        </TimeProvider>
      </UndoRedoProvider>
    </SudokuProvider>
  );
}

export default MyApp;
