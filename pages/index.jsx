import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import Layout from '@components/layout/layout'
import PostCard from '@components/postCard'
import Header from '@components/layout/header'

const IndexPage = () => {
  useEffect(() => {
    getPosts()
  }, [])

  const [posts, setposts] = useState([])

  const getPosts = async () => {
    const res = await fetch('/api/posts')
    const json = await res.json()
    setposts(json)
  }

  return (
    <Layout>
      <Header title={"Serverless Blog"}/>
      <div className="page">
        <Container>
          <Row>
            {posts.map(post => (<Col lg={4} className="mb-4"><PostCard post={post}/></Col>))}
          </Row>
        </Container>
      </div>
    </Layout>
  )
}

export default IndexPage