import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'

import { getPost, getPage } from '@lib/crud-helpers'
import { BlogContext } from '@contexts/blogContext'

import Layout from '@components/layout/layout'
import Header from '@components/layout/header'
import Posts from '@components/pages/posts'
import Post from '@components/pages/post'
import Page from '@components/pages/page'

const IndexPage = ({ post, page }) => {
  const router = useRouter()

  const [componentToShow, setComponentToShow] = useState('')
  const [state, dispatch] = useContext(BlogContext)

  const setActivePost = (post) =>
    dispatch({
      type: 'SET_ACTIVE_POST',
      payload: post
    })

  const setActivePage = (page) =>
    dispatch({
      type: 'SET_ACTIVE_PAGE',
      payload: page
    })

  const setHeaderInfo = (title, thumb) =>
    dispatch({
      type: 'SET_HEADER_INFO',
      payload: {title: title, thumb: thumb}
    })

  // const getPostBySlug = (slug) => {
  //   const post = state.posts.filter(post => post.slug == slug)
  //   if (post.length > 0) return post[0]
  //   return false
  // }

  // const getPageBySlug = (slug) => {
  //   const page = state.pages.filter(page => page.slug == slug)
  //   if (page.length > 0) return page[0]
  //   return false
  // }

  const goToPost = (post) => {
    setActivePost(post)
    setComponentToShow(<Post />)
    setHeaderInfo(null, post.thumb)
  }

  const goToPosts = () => {
    setComponentToShow(<Posts />)
    setActivePost(null)
    setHeaderInfo('Serverless Blog', null)
  }

  const goToPage = (page) => {
    setActivePage(page)
    setComponentToShow(<Page />)
    setHeaderInfo(page.title, page.thumb)
  }

  useEffect(() => {
    if (post) goToPost(post)
    // if (router.query.post && state.posts.includes(getPostBySlug(router.query.post))) {
    //   goToPost(state.posts.filter(post=>post.slug==router.query.post)[0])
    // }
    else if (page) goToPage(page)
    // else if (router.query.page && state.pages.includes(router.query.page)) {
    //   goToPage(state.pages.filter(page=>page.slug==router.query.page)[0])
    // }
    else goToPosts()
  }, [router.query])


  return (
    <Layout>
      <Header />
      <div className="page">
        { componentToShow }
      </div>
    </Layout>
  )
}

IndexPage.getInitialProps = async (context) => {
  const { page, post, archive, search, category } = context.query
  if (post) {
    const fetchPost = await getPost(post)
    if (!fetchPost.error) return { post: fetchPost }
  }
  if (page) {
    const fetchPage = await getPage(page)
    if (!fetchPage.error) return { page: fetchPage }
  }
  return {}
}

export default IndexPage