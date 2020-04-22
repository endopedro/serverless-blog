import React from 'react'
import Image from 'react-bootstrap/Image'

const Header = (props) => (
  <header className="header">
    {props.children}
    <div className="header-wrapper">
      <Image className="header-image" src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/23298a55526729.5988857400116.jpg" />
      <h1 className="header-title">Title</h1>
    </div>
  </header>
)

export default Header