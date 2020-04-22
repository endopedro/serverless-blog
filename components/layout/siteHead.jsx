import React from 'react'
import Head from 'next/head'

const SiteHead = () => (
  <Head>
    <title>Serverless Blog</title>
    <meta
      key="viewport"
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta
      name="description"
      content="This is a blog made using the serveless stack"
    />
    <meta property="og:title" content="Serverless Blog" />
    <meta
      property="og:description"
      content="This is a blog made using the serveless stack"
    />
    <meta
      property="og:image"
      content=""
    />
  </Head>
)

export default SiteHead