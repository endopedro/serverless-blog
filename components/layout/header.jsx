import React from 'react'
import Image from 'react-bootstrap/Image'
import { Container } from 'react-bootstrap'

const Header = (props) => {
  const title = props.title ? props.title : ''
  const image = props.img ? props.img : "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/23298a55526729.5988857400116.jpg"

  return (
    <header className="header">
      <div className="header-wrapper">
        <Image className="header-image" src={image} />
        <Container className="h-100">
          <h1 className="header-title">{title}</h1>
        </Container>
      </div>
    </header>
  )
}

export default Header