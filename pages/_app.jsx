import React from 'react'
import { BlogContextProvider } from "@contexts/blogContext"

export default function MyApp({ Component, pageProps }) {
  return (
    <BlogContextProvider>
      <Component {...pageProps} />
    </BlogContextProvider>
  )
}