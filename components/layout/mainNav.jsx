import React, { useState, useEffect, useContext } from 'react'
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap'
import Link from 'next/link'
import { useUser } from '@lib/hooks'

import MenuDropDown from '@components/layout/menuDropDown'
import { BlogContext } from '@contexts/blogContext'
import { getPages } from '@lib/crud-helpers'

const MainNav = () => {
  const [state, dispatch] = useContext(BlogContext)
  const [user, { mutate }] = useUser()
  const [pages, setPages] = useState(null)

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'DELETE',
    })
    mutate(null)
  }

  const loadPages = async () =>
    dispatch({
      type: 'SET_PAGES',
      payload: await getPages()
    })

  useEffect(() => {
    loadPages()
  }, [])

  return (
    <Navbar expand="md" className="main-nav">
      <Link href="/" passHref>
        <Navbar.Brand>Blog</Navbar.Brand>
      </Link>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Nav className="mr-auto">
          {state.pages?.map((page, index) => (
            <Link href={`/?page=${page.slug}`} key={index} passHref>
              <Nav.Link >{page.title}</Nav.Link>
            </Link>
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
              <div className="dropdown-divider" role="separator"></div>
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