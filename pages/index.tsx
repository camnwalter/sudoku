import { NextPage } from "next";
import Head from "next/head";

const Index: NextPage = () => {
  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/static/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Sudoku" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://squagward.com" />
        <meta
          property="og:image"
          content="https://github.com/Squagward/sudoku/raw/master/logo512.png"
        />
        <meta
          property="og:description"
          content="Classic sudoku inspired by Cracking the Cryptic"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="apple-touch-icon" href="/static/logo192.png" />
        <link rel="manifest" href="/static/manifest.json" />
        <title>Sudoku</title>
      </Head>
    </div>
  );
};

export default Index;
