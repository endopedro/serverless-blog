import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ReactLoading from 'react-loading'

import { getPosts } from '@lib/crud-helpers'
import { BlogContext } from '@contexts/blogContext'

import PostCard from '@components/postCard'

const Posts = () => {
  const [state, dispatch] = useContext(BlogContext)
  const [loading, setLoading] = useState(false)

  const loadPosts = async () =>
    dispatch({
      type: 'SET_POSTS',
      payload: await getPosts()
    })

  useEffect(() => {
    setLoading(true)
    loadPosts()
    setLoading(false)
  }, [])

  return (
    <Container>
      <Row>
        {state.posts?.map((post, index) => (
          <Col lg={4} className="mb-4" key={index}>
            <PostCard post={post} />
          </Col>))}
        {loading ? <ReactLoading type="spin" color="#0D7EA6" className="my-5 mx-auto" /> : ''}
      </Row>
    </Container>
  )
}

export default Posts