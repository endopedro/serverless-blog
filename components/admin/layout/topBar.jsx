import React from 'react'
import { Image } from 'cloudinary-react'
import Link from 'next/link'
import { useUser } from '@lib/hooks'
import Navbar from 'react-bootstrap/Navbar'
import MenuDropDown from '@components/layout/menuDropDown'

const cloudName = process.env.CLOUDINARY_NAME

const TopBar = (props) => {
  const [user, { mutate }] = useUser()

  return (
    <Navbar className="admin-topbar" variant="dark">
      <Link href="/" passHref>
        <Navbar.Brand className="topbar-brand">BLOG</Navbar.Brand>
      </Link>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          <MenuDropDown admin/>
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default TopBar