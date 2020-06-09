import React, { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import { Form, Button, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { getUser } from '@lib/crud-helpers'
import { BlogContext } from '@contexts/blogContext'

const newEditor = props => {
  const [state, dispatch] = useContext(BlogContext)
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [editorForm, setEditorForm] = useState({
    name: '',
    email: '',
    password: '',
    method: 'POST'
  })

  const getEditorToEdit = () => {
    const editor = state.users.find(editor => editor._id == props.editorId)
    if(editor) {
      setEditorForm({
        ...editorForm,
        _id: editor._id,
        name: editor.name,
        email: editor.email,
        method: 'PATCH'
      })
    }
  }

  useEffect(() => {
    if(props.editorId) getEditorToEdit(props.editorId)
  }, [state.users, props.editorId])

  const handleEditorForm = (fieldName, value) => {
    setEditorForm(prevState => ({
      ...prevState,
      [fieldName]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/users?editor=true', {
      method: editorForm.method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editorForm),
    })
    if (res.status === 201) {
      const userObj = await res.json()
      if(editorForm.method == 'POST') {
        insertEditor(userObj)
        router.push(`/admin?editors=true`)
      }
      else updateEditor(editorForm._id)
      setSuccessMsg(userObj.name+' cadastrado com sucesso')
    } else {
      setErrorMsg(await res.text())
    }
  }

  const insertEditor = (editor) =>
    dispatch({ type: 'INSERT_USER', payload: editor })

  const updateEditor = async (id) =>{
    const editor = await getUser(id)
    dispatch({ type: 'UPDATE_USER', payload: editor })
  }

  return (
    <>
      <Head>
        <title>{editorForm=='post' ? 'Cadastrar ' : 'Editar '}editor</title>
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

          <Form.Group controlId="editorPassword">
            <Form.Label>{editorForm.method == 'POST' ? 'Senha' : 'Redefinir senha'}</Form.Label>
            <Form.Control
              type="password"
              placeholder="Digite a senha"
              value={editorForm.password}
              onChange={e => {handleEditorForm('password', e.target.value)}}
            />
          </Form.Group>

          <div className="mt-3 d-flex">
            <Link href="/admin?editors=true" passHref>
              <Button variant="dark" size={'sm'} className="mr-auto mr-3"><FontAwesomeIcon icon={faArrowCircleLeft} className="mr-2" />Cancelar</Button>
            </Link>
            <Button variant="info" size={'sm'} type="submit"><FontAwesomeIcon icon={faUserCheck} className="mr-2"/>
              {editorForm.method == 'POST' ? 'Cadastrar' : 'Concluir'}
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}

export default newEditor
