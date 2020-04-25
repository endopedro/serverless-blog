import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import Layout from '@components/layout/layout'
import PostCard from '@components/postCard'

const IndexPage = () => {
  return (
    <Layout>
      <Container>
        <Row>
          {[1,2,3].map(item => {
            return <Col lg={4}><PostCard /></Col>
          })}
        </Row>
      </Container>    
    </Layout>
  )
}

export default IndexPage