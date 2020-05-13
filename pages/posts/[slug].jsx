import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import fetch from 'isomorphic-unfetch'

 const Post = ({ post }) => {
  return (
    <Container>
      <Row>
        <h1>Post</h1>
        {post.title}
      </Row>
    </Container>
  )
}

Post.getInitialProps = async (context) => {
  const { slug } = context.query
  const res = await fetch(`${process.env.WEB_URI}/api/posts/get?slug=${slug}`)
  const json = await res.json()
  return { post: json }
}

export default Post
