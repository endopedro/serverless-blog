import React, { useContext } from 'react'
import { Container, Image as Image2 } from 'react-bootstrap'
import { Image } from 'cloudinary-react'
const cloudName = process.env.CLOUDINARY_NAME
import { BlogContext } from '@contexts/blogContext'

const Header = (props) => {
  const [state, dispatch] = useContext(BlogContext)
  const title = state.headerInfo.title ? state.headerInfo.title : ''

  return (
    <header className="header">
      <div className="header-wrapper">
        {state.headerInfo.thumb ? (
          <Image cloudName={cloudName} publicId={state.headerInfo.thumb} className="header-image" />
        ) : (
          <Image2 className="header-image" src='/bg.jpg' />
        )}
        <Container className="h-100">
          <h1 className="header-title">{title}</h1>
        </Container>
      </div>
    </header>
  )
}

export default Header