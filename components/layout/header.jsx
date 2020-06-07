import React, { useContext } from 'react'
import { Container } from 'react-bootstrap'
import { Image } from 'cloudinary-react'
const cloudName = process.env.CLOUDINARY_NAME
import { BlogContext } from '@contexts/blogContext'

const Header = () => {
  const [state, dispatch] = useContext(BlogContext)
  const title = state.headerInfo.title ? state.headerInfo.title : ''

  return (
    <header className="header">
      <div className="header-wrapper">
        <Image
          cloudName={cloudName}
          className="header-image"
          publicId={state.headerInfo.thumb ? state.headerInfo.thumb : `${process.env.WEB_URI}/bg.jpg`}
        />
        <Container className="h-100">
          <h1 className="header-title">{title}</h1>
        </Container>
      </div>
    </header>
  )
}

export default Header