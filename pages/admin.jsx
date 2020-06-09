import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useRouter } from 'next/router'

import { useUser } from '@lib/hooks'

import Layout from '@components/admin/layout/layout'
import Sidebar from '@components/admin/layout/sidebar'
import TopBar from '@components/admin/layout/topBar'
import Editors from '@components/admin/editors'
import AllPosts from '@components/admin/allPosts'
import NewPost from '@components/admin/newPost'
import NewPage from '@components/admin/newPage'
import Pages from '@components/admin/pages'
import Categories from '@components/admin/categories'
import EditProfile from '@components/admin/editProfile'
import LoadingPage from '@components/loadingPage'
import Login from '@pages/login'

const IndexPage = ({ page, action }) => {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [user, { mutate }] = useUser()
  const [isLogged, setIsLogged] = useState(false)
  const [activePage, setActivePage] = useState('')
  const [title, setTitle] = useState('Dashboard')

  useEffect(() => {
    if (user) {
      setIsLogged(true)
      setLoading(false)
    } else if (user === null) {
      setLoading(false)
    }
  }, [user])

  const handlePages = (page, title) => {
    setTitle(title)
    setActivePage(page)
  }

  useEffect(() => {
    if (router.query.posts) handlePages(<AllPosts />, 'Posts')
    else if (router.query.newPost) handlePages(<NewPost />, 'Novo Post')
    else if (router.query.editPost) handlePages(<NewPost postSlug={router.query.editPost} />, 'Editar Post')
    else if (router.query.editProfile) handlePages(<EditProfile />, 'Editar Perfil')
    else if (router.query.editors && user.role=='admin') handlePages(<Editors />, 'Editores')
    else if (router.query.pages) handlePages(<Pages />, 'Páginas')
    else if (router.query.newPage) handlePages(<NewPage />, 'Nova Página')
    else if (router.query.editPage) handlePages(<NewPage pageSlug={router.query.editPage}/>, 'Editar Página')
    else if (router.query.categories) handlePages(<Categories />, 'Categorias')
    else handlePages(<h1>conteudo</h1>, 'Dashboard')
  }, [router.query])

  if (loading) return <LoadingPage />
  if (!isLogged) return <Login/>

  return (
    <Layout>
      {user && (
        <div className="admin">
          <Sidebar title={title} />
          <div className="admin-content">
            <TopBar />
            <h2 className="admin-action-label text-capitalize">{title}</h2>
            { activePage }
          </div>
        </div>
      )}
    </Layout>
  )
}

export default IndexPage