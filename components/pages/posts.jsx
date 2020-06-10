import React, { useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ReactLoading from 'react-loading'

import { BlogContext } from '@contexts/blogContext'

import PostCard from '@components/postCard'

const Posts = () => {
  const [state, dispatch] = useContext(BlogContext)

  return (
    <Container>
      <Row>
        {state.posts ? (
          state.posts.map((post, index) => (
          <Col lg={4} md={6} className="mb-4" key={index}>
            <PostCard post={post} />
          </Col>))
        ):(
          <ReactLoading type="spin" color="#0D7EA6" className="my-5 mx-auto" />
        )}
      </Row>
    </Container>
  )
}

export default Posts