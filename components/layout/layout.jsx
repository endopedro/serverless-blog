import React, { useEffect, useContext } from 'react'

import { BlogContext } from '@contexts/blogContext'
import { getPosts, getPages } from '@lib/crud-helpers'

import SiteHead from '@components/layout/siteHead'
import MainNav from '@components/layout/mainNav'
import Footer from '@components/layout/footer'

import '@assets/styles/main.scss'

export default ({ children }) => {
  const [state, dispatch] = useContext(BlogContext)

  const loadPosts = async () =>
    dispatch({
      type: 'SET_POSTS',
      payload: await getPosts()
    })

  const loadPages = async () =>
    dispatch({
      type: 'SET_PAGES',
      payload: await getPages()
    })

  useEffect(() => {
    loadPages()
    loadPosts()
  }, [])

  return (
    <>
      <SiteHead />
      <MainNav />
      <main>{children}</main>
      <Footer />
    </>
  )
}