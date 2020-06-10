import React from 'react'
import { Image } from 'cloudinary-react'
const cloudName = process.env.CLOUDINARY_NAME
import Link from 'next/link'
import EditPageIcon from '@components/editPageIcon'
import { useUser } from '@lib/hooks'

const PostString = (props) => {
  const [user, { mutate }] = useUser()
  
  return (
    <Link href={`/?post=${props.post.slug}`} >
      <div className="post-string">
        <div className="post-string-header">
          <Image
            cloudName={cloudName}
            className="post-image"
            publicId={props.post.thumb ? props.post.thumb : `${process.env.WEB_URI}/bg.jpg`}
          />
        </div>
        <div className="post-string-body">
        {user && (<EditPageIcon type="Post" query={props.post.slug}/>)}
          <Link href={`/?profile=${props.post.author._id}`} >
            <Image
              cloudName={cloudName}
              className="post-author-image"
              publicId={props.post.author.profilePicture ? props.post.author.profilePicture : `${process.env.WEB_URI}/no-pic.jpg`}
            />
          </Link>
          <h5 className="post-title">{props.post.title}</h5>
        </div>
        <div className="post-string-footer"></div>
      </div>
    </Link>
  )
}

export default PostString