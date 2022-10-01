import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <meta lang="en-us" />
        <meta charSet="utf-8" />
        <meta property="og:title" content="Sudoku" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sudoku.squagward.com" />
        <meta
          property="og:image"
          content="https://github.com/Squagward/sudoku/master/public/android-chrome-512x512.png"
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
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
