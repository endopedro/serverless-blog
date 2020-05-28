import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import Layout from '@components/admin/layout/layout'
import Sidebar from '@components/admin/layout/sidebar'
import Editors from '@components/admin/editors'
import AllPosts from '@components/admin/allPosts'
import EditProfile from '@components/admin/editProfile'
import LoadingPage from '@components/loadingPage'
import Login from '@pages/login'
import { useUser } from '@lib/hooks'

const IndexPage = ({ page, action }) => {
  const pages = ['dashboard', 'posts', 'editProfile', 'editors']

  const [loading, setLoading] = useState(true)
  const [user, { mutate }] = useUser()
  const [isLogged, setIsLogged] = useState(false)
  const [activePage, setActivePage] = useState(pages.includes(page) ? page : 'dashboard')
  const [title, setTitle] = useState('Dashboard')

  useEffect(() => {
    if (user) {
      setIsLogged(true)
      setLoading(false)
    } else if (user === null) {
      setLoading(false)
    }
  }, [user])

  if (loading) return <LoadingPage />
  if (!isLogged) return <Login/>

  const handlePages = page => {
    setTitle(page)
    setActivePage(page)
  }

  const content = {
    dashboard: <h1>conteudo</h1>,
    posts: <AllPosts action={action} setTitle={setTitle}/>,
    editProfile: <EditProfile />,
    editors: <Editors />
  }

  return (
    <Layout>
      <div className="admin">
        <Sidebar
          handlePages={handlePages}
          pages={pages}
          activePage={activePage}
          user={user}
        />
        <div className="admin-content">
          <h2 className="admin-action-label text-capitalize">{title}</h2>

          {content[activePage]}
        </div>

      </div>
    </Layout>
  )
}

IndexPage.getInitialProps = context => (context.query)

export default IndexPage