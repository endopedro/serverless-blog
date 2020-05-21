import React from 'react'
import { Image } from 'cloudinary-react'
const cloudName = process.env.CLOUDINARY_NAME

const PostCard = (props) => (
  <div className="post-card" onClick={props.onClick}>
    <div className="post-card-header">
      <Image cloudName={cloudName} className="post-image" publicId={props.post.thumb}/>
    </div>
    <div className="post-card-body">
      <Image cloudName={cloudName} publicId={props.post.author.profilePicture} className="post-author-image" />
      <h5 className="post-title">{props.post.title}</h5>
    </div>
    <div className="post-card-footer"></div>
  </div>
)

export default PostCard