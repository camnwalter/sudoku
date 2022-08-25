import type { AppProps } from "next/app";
import Header from "../components/Header";
import { SudokuProvider } from "../hooks/sudokuContext";
import { TimeProvider } from "../hooks/timeContext";
import { UndoRedoProvider } from "../hooks/undoRedoContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <meta charSet="utf-8" />
      <link rel="icon" href="/static/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="Sudoku" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://squagward.com" />
      <meta
        property="og:image"
        content="https://github.com/Squagward/sudoku/raw/master/public/logo512.png"
      />
      <meta
        property="og:description"
        content="Classic sudoku inspired by Cracking the Cryptic"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="apple-touch-icon" href="/logo192.png" />
      <link rel="manifest" href="/manifest.json" />
      <title>Sudoku</title>
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
