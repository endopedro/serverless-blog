import React from 'react'
import { Image } from 'react-bootstrap'

const PostCard = () => {
  return (
    <div className="post-card">
      <div className="post-card-header">
        <Image className="post-image" src="https://pbs.twimg.com/media/Cj1neYKWYAAdwsi.jpg" />
      </div>
      <div className="post-card-body">
        <Image className="post-author-image" src="https://i.pinimg.com/originals/da/15/5b/da155b2989b58374c4e3930c957d9eee.jpg" />
        <h5 className="post-title">How Did Van Gogh's Turbulent Mind Depict One of the Most Complex Concepts in Physics?</h5>
      </div>
      <div className="post-card-footer"></div>
    </div>
  )
}

export default PostCard