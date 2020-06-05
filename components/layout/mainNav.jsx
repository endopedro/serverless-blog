import React, { useState, useEffect } from 'react'
import { Navbar, Nav, Form, FormControl, Button, Dropdown, DropdownButton } from 'react-bootstrap'
import Link from 'next/link'
import { useUser } from '@lib/hooks'
// import { Image } from 'cloudinary-react'
// const cloudName = process.env.CLOUDINARY_NAME

import MenuDropDown from '@components/layout/menuDropDown'

const MainNav = () => {
  const [user, { mutate }] = useUser()
  const [pages, setPages] = useState(null)

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'DELETE',
    })
    mutate(null)
  }

  const getPages = async () => {
    const res = await fetch('/api/posts?pages=true', {method: 'GET'})
    const json = await res.json()
    setPages(json)
  }

  useEffect(() => {
    getPages()
  }, [])

  return (
    <Navbar expand="md" className="main-nav">
      <Link href="/" passHref>
        <Navbar.Brand>Blog</Navbar.Brand>
      </Link>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Nav className="mr-auto">
          {pages?.map(page => (
            <Nav.Link>{page.title}</Nav.Link>
          ))}
          <Nav.Link>Arquivo</Nav.Link>
        </Nav>
        <Form inline>
          <FormControl type="text" placeholder="Pesquisar" className="mr-sm-2" />
        </Form>
        {user && (
          <>
            <MenuDropDown handleLogout={handleLogout} user={user}/>
            <Nav className="mr-auto d-md-none">
              <div class="dropdown-divider" role="separator"></div>
              <Link href="/admin" passHref><Nav.Link className="text-info">Administração</Nav.Link></Link>
              <Link href="/profile" passHref><Nav.Link className="text-info">Perfil</Nav.Link></Link>
              <Nav.Link onClick={handleLogout} className="text-danger">Sair</Nav.Link>
            </Nav>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default MainNav