import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import Layout from '@components/admin/layout/layout'
import Sidebar from '@components/admin/layout/sidebar'
import NewPost from '@components/admin/newPost'
import Login from '@pages/login'
import { useUser } from '@lib/hooks'

const IndexPage = () => {
  const actions = {
    dashboard: {
      label: "Dashboard",
      content: <h1>ADMIN DASHBOARD</h1>,
    },
    newPost: {
      label: "Novo Post",
      content: <NewPost/>
    }
  }

  const [loading, setLoading] = useState(true)
  const [user, { mutate }] = useUser()
  const [isLogged, setIsLogged] = useState(false)  
  const [action, setAction] = useState(actions.dashboard)  
  
  useEffect(() => {
    if (user) {
      setIsLogged(true)
      setLoading(false)
    } else if (user === null) {
      setLoading(false)
    }
  }, [user])

  if (loading) return <h1>LOADING...</h1>
  if (!isLogged) return <Login/>

  const handleActions = action => {
    setAction(actions[action])
  }

  return (
    <Layout>
      <div className="admin">
        <Sidebar handleActions={handleActions} actions={actions}/>
        <div className="admin-content">
          {action.content}
        </div>

      </div>
    </Layout>
  )
}


export default IndexPage