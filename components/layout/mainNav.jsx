import React, { useContext, useState } from 'react'
import { Navbar, Nav, Form, FormControl, NavDropdown } from 'react-bootstrap'
import Link from 'next/link'
import { useUser } from '@lib/hooks'
import { useRouter } from 'next/router'

import MenuDropDown from '@components/layout/menuDropDown'
import { BlogContext } from '@contexts/blogContext'

const MainNav = () => {
  const router = useRouter()
  const [state, dispatch] = useContext(BlogContext)
  const [user, { mutate }] = useUser()
  const [searchText, setSearchText] = useState('')

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'DELETE',
    })
    mutate(null)
  }

  const goSearch = () => {
    if(searchText) router.push(`/?search=${searchText}`)
    setSearchText('')
  }

  return (
    <Navbar expand="md" className="main-nav" fixed="top" variant="light" bg="light">
      <Link href="/" passHref>
        <Navbar.Brand>Blog</Navbar.Brand>
      </Link>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Nav className="mr-auto">
          {state.pages?.map((page, index) => (
            <Link href={`/?page=${page.slug}`} key={index} passHref>
              <Nav.Link>{page.title}</Nav.Link>
            </Link>
          ))}
          {state.categories.length > 0 && (
            <NavDropdown title="Categorias" id="basic-nav-dropdown">
              {state.categories.map((category, index) => (
                <Link href={`/?category=${category.name}`} key={index} passHref>
                  <NavDropdown.Item>{category.name}</NavDropdown.Item>
                </Link>
              ))}
            </NavDropdown>
          )}
        </Nav>
          <FormControl
            type="text"
            placeholder="Pesquisar"
            className="mr-sm-2 navbar-search"
            onChange={e => setSearchText(e.target.value)}
            value={searchText}
            onKeyPress={event => {
              if (event.key === 'Enter') goSearch()
            }}
          />
        {user && (
          <>
            <MenuDropDown />
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