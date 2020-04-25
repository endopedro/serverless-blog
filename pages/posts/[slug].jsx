import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import nextConnect from 'next-connect'

import database from '@middlewares/database'

const Post = () => {
  return (
    <Container>
      <Row>
        <h1>Post</h1>
      </Row>
    </Container> 
  )
}

export default Post
