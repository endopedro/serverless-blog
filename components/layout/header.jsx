import React from 'react'
import { Container, Image as Image2 } from 'react-bootstrap'
import { Image } from 'cloudinary-react'
const cloudName = process.env.CLOUDINARY_NAME

const Header = (props) => {
  const title = props.title ? props.title : ''

  return (
    <header className="header">
      <div className="header-wrapper">
        {props.img ? (
          <Image cloudName={cloudName} publicId={props.img} className="header-image" />
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