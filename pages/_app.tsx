import "../styles/globals.css";

import Head from "next/head";
import React from "react";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>gentopia.dev - the generative place</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
