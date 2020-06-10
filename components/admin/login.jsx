import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Form, Button } from 'react-bootstrap'

import { useUser } from '@lib/hooks'
import LoginLayout from '@components/layout/loginLayout'
import SignUp from '@components/admin/signup'
import { countUsers } from '@lib/crud-helpers'

const LoginPage = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [user, { mutate }] = useUser()
  const [usersCount, setUsersCount] = useState(null)

  useEffect(() => {
    handleUsersCount()
  }, [])
  
  const handleUsersCount = async () => setUsersCount(await countUsers())

  async function onSubmit(e) {
    e.preventDefault()
    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    }
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status === 200) {
      const userObj = await res.json()
      mutate(userObj)
    } else {
      setErrorMsg('Incorrect username or password. Try again!')
    }
  }

  if (usersCount == 0) return <SignUp/>

  return (
    <LoginLayout>
      <Head>
        <title>Login</title>
      </Head>
      <h3 className="login-title">Login</h3>
      <Form className="login-form" onSubmit={onSubmit}>
        {errorMsg ? <Form.Text className="login-alert">{errorMsg}</Form.Text> : ''}
        <Form.Group controlId="formBasicEmail">
          <Form.Control id="email" type="email" placeholder="Digite seu e-mail..." required />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Control id="password" type="password" placeholder="Digite sua senha..." required />
        </Form.Group>
        <Form.Group>
          <Link href="/forget-password"><a>Esqueci minha senha</a></Link>
        </Form.Group>
        <Button variant="info" type="submit">
          Login
        </Button>
      </Form>
    </LoginLayout>
  )
}

export default LoginPage
