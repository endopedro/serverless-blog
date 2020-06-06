import React, { useContext } from 'react'
import { Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeatherAlt, faCalendarAlt, faEye, faTags } from '@fortawesome/free-solid-svg-icons'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

import { BlogContext } from '@contexts/blogContext'

 const Post = () => {
  const [state, dispatch] = useContext(BlogContext)
  const post = state.activePost
  const author = state.activePost.author

  // const convertedState = convertFromRaw((post.content))
  // const editorValue = EditorState.createWithContent(convertedState)
  // const content = draftToHtml((convertToRaw(editorValue.getCurrentContent())))
  const content = draftToHtml(convertToRaw(EditorState.createWithContent(convertFromRaw((post.content))).getCurrentContent()))

  const getPostDate = dateRaw => {
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'novembro', 'dezembro']
    const date = new Date(dateRaw)
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`
  }

   return (
    <Container>
      <div className="single-post">
        <div className="post-header">
          <h5 className="post-category">#{post.category}</h5>
          <div className="post-clicks"><FontAwesomeIcon icon={faEye} className="eye-icon" />{post.clicks+1}</div>
        </div>
        <h2 className="post-title">{post.title}</h2>
        <div className="post-author">
          <span className="info-item"><FontAwesomeIcon icon={faFeatherAlt} /> {author.name}</span>
          <span className="info-item"><FontAwesomeIcon icon={faCalendarAlt} /> {getPostDate(post.date)}</span>
        </div>
        <div className="post-content" dangerouslySetInnerHTML={{__html: content}}></div>
        <div className="post-tags">
          <FontAwesomeIcon icon={faTags} className="tag-icon"/>
          {post.tags ? post.tags.map( tag => (<div className="post-tag">{tag}</div>)) : ''}
        </div>
      </div>
    </Container>
  )
}

export default Post
