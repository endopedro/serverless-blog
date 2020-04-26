import React from 'react'
import { Image } from 'react-bootstrap'

const PostCard = (props) => {
  return (
    <div className="post-card">
      <div className="post-card-header">
        <Image className="post-image" src={props.post.thumb} />
      </div>
      <div className="post-card-body">
        <Image className="post-author-image" src={props.post.author.profilePicture} />
        <h5 className="post-title">{props.post.title}</h5>
      </div>
      <div className="post-card-footer"></div>
    </div>
  )
}

export default PostCard