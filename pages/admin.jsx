import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { useUser } from '@lib/hooks'

import Login from '@components/admin/login'
import Layout from '@components/admin/layout/layout'
import Sidebar from '@components/admin/layout/sidebar'
import TopBar from '@components/admin/layout/topBar'
import Dashboard from '@components/admin/dashboard'
import Editors from '@components/admin/editors'
import NewEditor from '@components/admin/newEditor'
import AllPosts from '@components/admin/allPosts'
import NewPost from '@components/admin/newPost'
import NewPage from '@components/admin/newPage'
import Pages from '@components/admin/pages'
import Categories from '@components/admin/categories'
import EditProfile from '@components/admin/editProfile'
import LoadingPage from '@components/loadingPage'

const IndexPage = () => {
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
    else if (router.query.editors) handlePages(<Editors />, 'Editores')
    else if (router.query.newEditor) handlePages(<NewEditor />, 'Novo Editor')
    else if (router.query.editEditor) handlePages(<NewEditor editorId={router.query.editEditor} />, 'Editar Editor')
    else if (router.query.pages) handlePages(<Pages />, 'Páginas')
    else if (router.query.newPage) handlePages(<NewPage />, 'Nova Página')
    else if (router.query.editPage) handlePages(<NewPage pageSlug={router.query.editPage}/>, 'Editar Página')
    else if (router.query.categories) handlePages(<Categories />, 'Categorias')
    else handlePages(<Dashboard />, 'Dashboard')
  }, [router.query])

  if (loading) return <LoadingPage />
  if (!isLogged) return <Login/>

  return (
    <Layout>
      <Head><title>ADMIN | {title}</title></Head>
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