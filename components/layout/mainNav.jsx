import React from 'react'
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap'
import Link from 'next/link'
import { useUser } from '@lib/hooks'

const MainNav = () => {
  const [user, { mutate }] = useUser()

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'DELETE',
    })
    mutate(null)
  }
  
  return (
    <Navbar expand="md" className="main-nav">
      <Link href="/" passHref>
        <Navbar.Brand>Blog</Navbar.Brand>
      </Link>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Nav className="mr-auto">
          <Nav.Link>Sobre</Nav.Link>
          <Nav.Link>Arquivo</Nav.Link>
        </Nav>
        <div className="ml-auto main-nav-login">
          <Nav.Link>Hello, {user ? user.name : 'stranger'}</Nav.Link>
          {!user ? (
            <>
              <Link href="/login" passHref><Nav.Link>Login</Nav.Link></Link>
              <Link href="/signup" passHref><Nav.Link>Cadastrar</Nav.Link></Link>
            </>
          ) : (
            <>
              <Link href="/profile" passHref><Nav.Link>Perfil</Nav.Link></Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </>
          )}
        </div>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-success">Search</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default MainNav