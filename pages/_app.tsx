import React from "react";
import Head from "next/head";

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
