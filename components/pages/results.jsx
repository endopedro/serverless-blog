import React, { useContext, useEffect, useState } from 'react'
import { Container, ListGroup } from 'react-bootstrap'

import { BlogContext } from '@contexts/blogContext'
import PostString from '@components/postString'

const Results = (props) => {
  const [state, dispatch] = useContext(BlogContext)
  const [posts, setPosts] = useState([])

  const getPostsByCategory = (category) => {
    setPosts(state.posts.filter(post => post.category == category))
  }

  const searchInPosts = (term) => {
    setPosts(state.posts.filter(post => post.title.toLowerCase().includes(term.toLowerCase())))
  }

  useEffect(() => {
    if(props.type == 'category') getPostsByCategory(props.query)
    else if(props.type == 'search') searchInPosts(props.query)
  }, [state.posts, props])

  return (
    <Container>
      <div className="single-page">
        {posts.length > 0 ? (
          posts.map((post,key) => (<PostString key={key} post={post}/>))
        ) : (
          <h4 className="text-center my-5">Nenhum post encontrado para esta categoria.</h4>
        )}
      </div>
    </Container>
  )
}

export default Results
