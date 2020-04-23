import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import PostCard from '@components/postCard'

const IndexPage = () => {
  return (
    <Container>
      <Row>
        {[1,2,3].map(item => {
          return <Col lg={4}><PostCard /></Col>
        })}
      </Row>
    </Container>    
  )
}

export default IndexPage