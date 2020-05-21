import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import fetch from 'isomorphic-unfetch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeatherAlt, faCalendarAlt, faEye, faTags } from '@fortawesome/free-solid-svg-icons'
import { EditorState, ContentState, convertFromRaw, convertToRaw } from 'draft-js'
// import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import dynamic from 'next/dynamic'
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)

import Layout from '@components/layout/layout'
import Header from '@components/layout/header'

 const Post = ({ post, author }) => {
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
    <Layout>
      <Header img={post.thumb}/>
      <div className="page">
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
      </div>
    </Layout>
  )
}

Post.getInitialProps = async (context) => {
  const { slug } = context.query
  const res = await fetch(`${process.env.WEB_URI}/api/posts?slug=${slug}`,{method: 'GET'})
  const json = await res.json()
  return { post: json.post, author: json.author }
}

export default Post
