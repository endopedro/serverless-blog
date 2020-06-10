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
      content="Um blog desenvolvido com a stack serverless."
    />
    <meta property="og:title" content="Serverless Blog" />
    <meta
      property="og:description"
      content="Um blog desenvolvido com a stack serverless."
    />
    <meta
      property="og:image"
      content={`${process.env.WEB_URI}/blog.png`}
    />
  </Head>
)

export default SiteHead