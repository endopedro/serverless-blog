import React from 'react'
import Head from 'next/head'
import Layout from '@components/layout'

import './../assets/styles/main.scss'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <title>Serverless Blog</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}