import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'

import { getPost, getPage, getCategories } from '@lib/crud-helpers'
import { BlogContext } from '@contexts/blogContext'

import Layout from '@components/layout/layout'
import Header from '@components/layout/header'
import Posts from '@components/pages/posts'
import Post from '@components/pages/post'
import Page from '@components/pages/page'
import Results from '@components/pages/results'
import LoadingPage from '@components/loadingPage'

const IndexPage = () => {
  const router = useRouter()

  const [componentToShow, setComponentToShow] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [state, dispatch] = useContext(BlogContext)

  const setHeaderInfo = (title, thumb) =>
    dispatch({ type: 'SET_HEADER_INFO', payload: {title: title, thumb: thumb} })

  const getPostBySlug = (slug) => state.posts.find(post => post.slug == slug)

  const getPageBySlug = (slug) => state.pages.find(page => page.slug == slug)

  const goToPosts = () => {
    setComponentToShow(<Posts />)
    setHeaderInfo('Serverless Blog', null)
  }

  const goToPost = async (slug) => {
    let fetchPost = {}
    if(!state.posts.includes(getPostBySlug(slug))) {
      setIsLoading(true)
      fetchPost = await getPost(slug)
      setIsLoading(false)
      if(!fetchPost.slug) return
    }
    const post = fetchPost.slug ? fetchPost : getPostBySlug(slug)
    setComponentToShow(<Post post={post}/>)
    setHeaderInfo(null, post.thumb)
  }

  const goToPage = async (slug) => {
    let fetchPage = {}
    if(!state.pages.includes(getPageBySlug(slug))) {
      setIsLoading(true)
      fetchPage = await getPage(slug)
      setIsLoading(false)
      if(!fetchPage.slug) return
    }
    const page = fetchPage.slug ? fetchPage : getPageBySlug(slug)
    setComponentToShow(<Page page={page}/>)
    setHeaderInfo(page.title, page.thumb)
  }

  const goToResults = (query, type, title) => {
    setComponentToShow(<Results query={query} type={type}/>)
    setHeaderInfo(title , null)
  }

  useEffect(() => {
    if (router.query.post) goToPost(router.query.post)
    else if (router.query.page) goToPage(router.query.page)
    else if (router.query.category) goToResults(router.query.category, 'category', router.query.category)
    else if (router.query.search) goToResults(router.query.search, 'search', `Pesquisa: ${router.query.search}`)
    else if (router.query.tag) goToResults(router.query.tag, 'tag', `Tag: ${router.query.tag}`)
    else goToPosts()
  }, [router.query])

  if(isLoading) return <LoadingPage/>

  return (
    <Layout>
      <Header />
      <div className="page">
        { componentToShow }
      </div>
    </Layout>
  )
}

export default IndexPage