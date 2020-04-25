import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import Layout from '@components/admin/layout/layout'

const IndexPage = () => {
  return (
    <Layout>
      <Container>
        <Row>
          <h1>ADMIN INDEX</h1>
        </Row>
      </Container>    
    </Layout>
  )
}

export default IndexPage