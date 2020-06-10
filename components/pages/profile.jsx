import React, { useEffect, useState, useContext } from 'react'
import { Image } from 'cloudinary-react'
import { Container } from 'react-bootstrap'
const cloudName = process.env.CLOUDINARY_NAME
import PostString from '@components/postString'
import { useUser } from '@lib/hooks'

import { BlogContext } from '@contexts/blogContext'
import EditPageIcon from '@components/editPageIcon'

const Profile = (props) => {
  const [state, dispatch] = useContext(BlogContext)
  const [authorPosts, setAuthorPosts] = useState([])
  const [user, { mutate }] = useUser()

  useEffect(() => {
    setAuthorPosts(state.posts.filter(post => post.author._id == props.user._id))
  }, [state.posts])

  return (
    <Container>
      <div className="profile">
        {(user?._id==props.user._id) && (<EditPageIcon type="Profile" query={true}/>)}
        <Image
          cloudName={cloudName}
          className="profile-picture"
          publicId={props.user.profilePicture ? props.user.profilePicture : `${process.env.WEB_URI}/bg.jpg`}
        />
        <h2 className="profile-name">{props.user.name}</h2>
        <span className="profile-email">{props.user.email}</span>
        <div className="profile-bio">
          <p className="bio-text">{props.user.bio}</p>
        </div>
        <hr className="divisor"/>
        {authorPosts.length > 0 ? (
          <>
            <h5 className="my-3">Posts:</h5>
            {authorPosts.map((post,key) => (<PostString key={key} post={post}/>))}
          </>
        ) : (
          <h4 className="text-center my-5">Nenhum post encontrado para esta categoria.</h4>
        )}
      </div>
    </Container>
  )
}

export default Profile