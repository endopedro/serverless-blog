import React from 'react'
import Head from 'next/head'

import MainNav from '@components/mainNav'

export default ({ children }) => {
  return (
    <>
      <Head>
        <title>Next.js + MongoDB App</title>
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta
          name="description"
          content="nextjs-mongodb-app is a continously developed app built with Next.JS and MongoDB. This project goes further and attempts to integrate top features as seen in real-life apps."
        />
        <meta property="og:title" content="Next.js + MongoDB App" />
        <meta
          property="og:description"
          content="nextjs-mongodb-app is a continously developed app built with Next.JS and MongoDB. This project goes further and attempts to integrate top features as seen in real-life apps."
        />
        <meta
          property="og:image"
          content="https://repository-images.githubusercontent.com/201392697/5d392300-eef3-11e9-8e20-53310193fbfd"
        />
      </Head>
      <header>
        <MainNav />
      </header>

      <main>{children}</main>
      <footer>
        <p>
          Made with
          {' '}
          <span role="img" aria-label="Love">
            ❤️
          </span>
          ,
          {' '}
          <span role="img" aria-label="Fire">
            🔥
          </span>
          , and a keyboard by
          {' '}
          <a href="https://www.hoangvvo.com/">Hoang Vo</a>
.
        </p>
        <p>
          Source code is on
          {' '}
          <a href="https://github.com/hoangvvo/nextjs-mongodb-app">Github</a>
.
        </p>
      </footer>
    </>
  );
};
