import React, { useContext } from 'react'
import { Container, ListGroup } from 'react-bootstrap'

import { BlogContext } from '@contexts/blogContext'

const Results = (props) => {
  const [state, dispatch] = useContext(BlogContext)

  return (
    <Container>
      <div className="single-page">
        {props.type}: {props.query}
      </div>
    </Container>
  )
}

export default Results
