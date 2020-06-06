import React from 'react'
import { Image } from 'cloudinary-react'
const cloudName = process.env.CLOUDINARY_NAME
import Link from 'next/link'

const PostCard = (props) => (
  <Link href={`/?post=${props.post.slug}`} >
    <div className="post-card">
      <div className="post-card-header">
        <Image
          cloudName={cloudName}
          className="post-image"
          publicId={props.post.thumb ? props.post.thumb : `${process.env.WEB_URI}/bg.jpg`}
        />
      </div>
      <div className="post-card-body">
        <Image
          cloudName={cloudName}
          className="post-author-image"
          publicId={props.post.author.profilePicture ? props.post.author.profilePicture : `${process.env.WEB_URI}/no-pic.jpg`}
        />
        <h5 className="post-title">{props.post.title}</h5>
      </div>
      <div className="post-card-footer"></div>
    </div>
  </Link>
)

export default PostCard