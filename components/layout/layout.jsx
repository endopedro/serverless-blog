import React from 'react'

import SiteHead from '@components/layout/siteHead'
import Header from '@components/layout/header'
import MainNav from '@components/layout/mainNav'

export default ({ children }) => {
  return (
    <>
      <SiteHead />
      <Header>
        <MainNav />
      </Header>

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
