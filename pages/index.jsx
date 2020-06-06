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
    else if (router.query.post) goToPost(state.posts.filter(post=>post.slug==router.query.post)[0])
    else if (page) goToPage(page)
    else if (router.query.page) goToPage(state.pages.filter(page=>page.slug==router.query.page)[0])
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
    return { post: fetchPost }
  } else if (page) {
    const fetchPage = await getPage(page)
    return { page: fetchPage }
  } else {
    return {}
  }
}

export default IndexPage