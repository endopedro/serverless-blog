import React, { useEffect, useContext } from 'react'
import { Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeatherAlt, faCalendarAlt, faEye, faTags, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import Link from 'next/link'
import { useUser } from '@lib/hooks'

import EditPageIcon from '@components/editPageIcon'
import { incPostView } from '@lib/crud-helpers'
import { BlogContext } from '@contexts/blogContext'

 const Post = (props) => {
  const [user, { mutate }] = useUser()
  const post = props.post
  const author = props.post.author
  const [state, dispatch] = useContext(BlogContext)

  useEffect(() => {
    incPostView(props.post.slug)
    props.post.clicks+=1
    updatePost(props.post)
  }, [props.post])

  const updatePost = async (post) =>{
    dispatch({ type: 'UPDATE_POST', payload: post })
  }

  // const convertedState = convertFromRaw((post.content))
  // const editorValue = EditorState.createWithContent(convertedState)
  // const content = draftToHtml((convertToRaw(editorValue.getCurrentContent())))
  const getContent = (content) => draftToHtml(convertToRaw(EditorState.createWithContent(convertFromRaw((content))).getCurrentContent()))

  const getPostDate = dateRaw => {
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'novembro', 'dezembro']
    const date = new Date(dateRaw)
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`
  }

   return (
    <Container>
      {post && (
        <div className="single-post">
          <div className="post-header">
            <Link href={`/?category=${post.category}`} passHref>
              <h5 className="post-category">#{post.category}</h5>
            </Link>
            <div className="post-clicks"><FontAwesomeIcon icon={faEye} className="eye-icon" />{post.clicks+1}</div>
            {user && (<EditPageIcon slug={post.slug}/>)}
          </div>
          <h2 className="post-title">{post.title}</h2>
          <Link href={`/?profile=${props.post.author._id}`} >
            <div className="post-author">
              <span className="info-item author"><FontAwesomeIcon icon={faFeatherAlt} /> {author.name}</span>
              <span className="info-item"><FontAwesomeIcon icon={faCalendarAlt} /> {getPostDate(post.date)}</span>
            </div>
          </Link>
          <div className="post-content" dangerouslySetInnerHTML={{__html: getContent(post.content)}}></div>
          {post.tags.length > 0 && (
            <div className="post-tags">
              <FontAwesomeIcon icon={faTags} className="tag-icon"/>
              {post.tags.map((tag,key) => (
                <Link href={`/?tag=${tag}`} passHref>
                  <div className="post-tag" key={key}>{tag}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </Container>
  )
}

export default Post
