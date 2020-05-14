import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import Layout from '@components/admin/layout/layout'
import Sidebar from '@components/admin/layout/sidebar'
import NewPost from '@components/admin/newPost'
import LoadingPage from '@components/loadingPage'
import Login from '@pages/login'
import { useUser } from '@lib/hooks'

const IndexPage = () => {
  const actions = [
    {
      label: "Dashboard",
      content: <h1>ADMIN DASHBOARD</h1>,
    },
    {
      label: "Novo Post",
      content: <NewPost/>
    }
  ]

  const [loading, setLoading] = useState(true)
  const [user, { mutate }] = useUser()
  const [isLogged, setIsLogged] = useState(false)
  const [action, setAction] = useState(actions[1])

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

  const handleActions = action => {
    setAction(action)
  }

  return (
    <Layout>
      <div className="admin">
        <Sidebar
          handleActions={handleActions}
          actions={actions}
          activeAction={action}
          user={user}
        />
        <div className="admin-content">
          <h2 className="admin-action-label">{action.label}</h2>
          {action.content}
        </div>

      </div>
    </Layout>
  )
}


export default IndexPage