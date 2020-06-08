import React, { useEffect, useContext } from 'react'

import { BlogContext } from '@contexts/blogContext'
import { getPosts, getPages, getCategories } from '@lib/crud-helpers'
import SiteHead from '@components/admin/layout/siteHead'

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

  const loadCategories = async () =>
    dispatch({
      type: 'SET_CATEGORIES',
      payload: await getCategories()
    })

  useEffect(() => {
    if(state.pages.length < 1) loadPages()
    if(state.posts.length < 1) loadPosts()
    if(state.categories.length < 1) loadCategories()
  }, [])

  return (
    <>
      <SiteHead />
      <main>{children}</main>
    </>
  )
}
