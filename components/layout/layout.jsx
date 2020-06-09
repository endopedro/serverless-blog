import React, { useEffect, useContext } from 'react'

import { BlogContext } from '@contexts/blogContext'
import { getPosts, getPages, getCategories, getUsers } from '@lib/crud-helpers'

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

  const loadCategories = async () =>
    dispatch({
      type: 'SET_CATEGORIES',
      payload: await getCategories()
    })

  const loadUsers = async () =>
    dispatch({
      type: 'SET_USERS',
      payload: await getUsers()
    })

  useEffect(() => {
    if(state.pages.length < 1) loadPages()
    if(state.posts.length < 1) loadPosts()
    if(state.categories.length < 1) loadCategories()
    if(state.users.length < 1) loadUsers()
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