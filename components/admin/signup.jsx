import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import { useUser } from '@lib/hooks'
import { Form, Button } from 'react-bootstrap'

import LoginLayout from '@components/layout/loginLayout'

const SignUp = () => {
  const [user, { mutate }] = useUser()
  const [errorMsg, setErrorMsg] = useState('')
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) Router.replace('/')
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = {
      email: e.currentTarget.email.value,
      name: e.currentTarget.name.value,
      password: e.currentTarget.password.value,
    }
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status === 201) {
      const userObj = await res.json()
      mutate(userObj)
    } else {
      setErrorMsg(await res.text())
    }
  }

  return (
    <LoginLayout>
      <Head>
        <title>Cadastrar</title>
      </Head>
      <h3 className="login-title">Primeiro acesso ao blog.<br/>Por favor realize o cadastro para iniciar.</h3>
      <Form className="login-form" onSubmit={handleSubmit}>
        {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
        <Form.Group controlId="formBasicEmail">
          <Form.Control id="name" name="name" type="text" placeholder="Digite seu nome..." required />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Control id="email" name="email" type="email" placeholder="Digite seu e-mail..." required />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Control id="password" name="password" type="password" placeholder="Crie uma senha..." required />
        </Form.Group>
        <Button variant="info" type="submit">
          Cadastrar
        </Button>
      </Form>
    </LoginLayout>
  )
}

export default SignUp
