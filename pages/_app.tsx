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
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="Sudoku" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://sudoku.squagward.com" />
      <meta
        property="og:image"
        content="https://github.com/Squagward/sudoku/raw/master/public/logo512.png"
      />
      <meta
        property="og:description"
        content="Classic sudoku inspired by Cracking the Cryptic"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
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
