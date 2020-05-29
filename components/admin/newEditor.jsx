import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import { useUser } from '@lib/hooks'
import { Form, Button, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faPencilAlt, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons'

const newEditor = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [editorForm, setEditorForm] = useState({
    name: '',
    email: ''
  })

  const handleEditorForm = (fieldName, value) => {
    setEditorForm(prevState => ({
      ...prevState,
      [fieldName]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // let formData = new FormData()
    // formData.append("name", editorForm.name)
    // formData.append("email", editorForm.email)
    // for (var key of formData.entries()) {
    //   console.log(key[0] + ', ' + key[1]);
    // }
    const res = await fetch('/api/users?editor=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editorForm),
    })
    if (res.status === 201) {
      const userObj = await res.json()
      console.log(userObj)
      setSuccessMsg(userObj.name+' cadastrado com sucesso')
    } else {
      setErrorMsg(await res.text())
    }
  }

  return (
    <>
      <Head>
        <title>Cadastrar editor</title>
      </Head>
      <div className="admin-content-element">
        <Form onSubmit={handleSubmit}>
          {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
          {successMsg ? <p style={{ color: 'green' }}>{successMsg}</p> : null}

          <Form.Group controlId="editorName">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              placeholder="Digite o nome"
              onChange={e => {handleEditorForm('name', e.target.value)}}
              value={editorForm.name}
            />
          </Form.Group>

          <Form.Group controlId="editorEmail">
            <Form.Label>E-mail</Form.Label>
            <Form.Control
              placeholder="Digite o e-mail"
              onChange={e => {handleEditorForm('email', e.target.value)}}
              value={editorForm.email}
              type="email"
            />
          </Form.Group>
          <Button variant="info" size={'sm'} type="submit"><FontAwesomeIcon icon={faUserCheck} className="mr-2"/>Cadastrar</Button>
        </Form>
      </div>
    </>
  )
}

export default newEditor
