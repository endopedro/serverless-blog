import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useUser } from '@lib/hooks'
import { Form, Button, Row, Col } from 'react-bootstrap'
import {Image} from 'cloudinary-react'

const EditProfile = () => {
  const [user, { mutate }] = useUser()
  const [isUpdating, setIsUpdating] = useState(false)
  const [pictureName, setPictureName] = useState(null)
  const [msg, setMsg] = useState({ message: '', isError: false })
  const profilePictureRef = React.createRef()
  const [userData, setUserData] = useState({
    name: '',
    bio: '',
    profilePicture: ''
  })

  useEffect(() => {
    setUserData({
      ...userData,
      name: user.name,
      bio: user.bio,
      profilePicture: user.profilePicture
    })
  }, [user])

  const handleSubmitUserInfo = async (event) => {
    event.preventDefault()
    if (isUpdating) return
    setIsUpdating(true)

    let formData = new FormData()

    formData.append('name', userData.name)
    formData.append('bio', userData.bio)
    if (profilePictureRef.current.files[0]) formData.append('profilePicture', profilePictureRef.current.files[0])
    if (userData.profilePicture) formData.append('currentProfilePicture', userData.profilePicture)
    const res = await fetch('/api/users', {
      // headers: { "Content-Type": "application/json" },
      method: 'PATCH',
      body: formData,
    })

    if (res.status === 200) {
      const newUserData = await res.json()
      mutate({
        user: {
          ...user,
          ...newUserData.user,
        },
      })
      setMsg({ message: 'Profile updated' })
      setPictureName(null)
    } else {
      setMsg({ message: await res.text(), isError: true })
    }
    setIsUpdating(false)
  }

  // const handleSubmitPicture = async (event) => {
  //   event.preventDefault()
  //   if (isUpdating) return
  //   setIsUpdating(true)

  //   let formData = new FormData

  //   formData.append('user', user)
  //   formData.append('currentProfilePicture', userData.profilePicture)

  //   console.log(profilePictureRef)
  //   if (profilePictureRef.current.files[0]) {
  //     formData.append('profilePicture', profilePictureRef.current.files[0])
  //   }

  //   const res = await fetch('/api/user/picture', {
  //     method: 'PATCH',
  //     body: formData,
  //   })

  //   if (res.status === 200) {
  //     const newUserData = await res.json()
  //     mutate({
  //       user: {
  //         ...user,
  //         profilePicture: newUserData.profilePicture,
  //       },
  //     })
  //     setMsg({ message: 'Picture updated' })
  //   } else {
  //     setMsg({ message: await res.text(), isError: true })
  //   }
  //   setIsUpdating(false)
  // }

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault()
    const body = {
      oldPassword: e.currentTarget.oldPassword.value,
      newPassword: e.currentTarget.newPassword.value,
    }
    e.currentTarget.oldPassword.value = ''
    e.currentTarget.newPassword.value = ''

    const res = await fetch('/api/user/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.status === 200) {
      setMsg({ message: 'Password updated' })
    } else {
      setMsg({ message: await res.text(), isError: true })
    }
  }

  const handleUserData = (fieldName, value) => {
    setUserData(prevState => ({
      ...prevState,
      [fieldName]: value
    }))
  }

  return (
    <>
      <Head>
        <title>Editar perfil</title>
      </Head>

      <Row>
        <Col>
          <div className="admin-content-element">
          {msg.message ? <p style={{ color: msg.isError ? 'red' : '#0070f3', textAlign: 'center' }}>{msg.message}</p> : null}

          <h4 className="mb-4">Editar perfil</h4>
          <Form onSubmit={handleSubmitUserInfo}>
            <Form.Group controlId="formGridName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="name"
                placeholder="Digite seu nome"
                value={userData.name}
                onChange={(e) => handleUserData('name', e.target.value)} />
            </Form.Group>
            <Form.Group controlId="forGridBio">
              <Form.Label>Biografia</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                value={userData.bio}
                onChange={(e) => handleUserData('bio', e.target.value)} />
            </Form.Group>
            <Form.Group controlId="forGridPicture">
              <Form.Label>Foto de perfil</Form.Label>
              <Form.File
                id="avatar"
                label={pictureName ? pictureName : "Selecione um arquivo"}
                data-browse="Selecionar"
                type="file"
                accept="image/png, image/jpeg"
                ref={profilePictureRef}
                onChange={(e) => setPictureName(e.target.value.split('\\').pop())}
                custom
              />
            </Form.Group>
            <Button variant="info" disabled={isUpdating} size='sm' type="submit">Salvar</Button>
          </Form>
        </div>
        </Col>
      </Row>
      <Row>
        {/* <Col md='6'>
          <div className="admin-content-element">
            <h4 className="mb-4">Foto de perfil</h4>
            <Form onSubmit={handleSubmitPicture}>
              <Form.Group controlId="forGridPicture">
                <Form.Label>Foto de perfil</Form.Label>
                <Form.File
                  id="avatar"
                  label={pictureName ? pictureName : "Selecione um arquivo"}
                  data-browse="Selecionar"
                  type="file"
                  accept="image/png, image/jpeg"
                  ref={profilePictureRef}
                  onChange={(e) => setPictureName(e.target.value.split('\\').pop())}
                  custom
                />
              </Form.Group>
              <Button variant="info" disabled={isUpdating || !pictureName} size='sm' type="submit">Salvar</Button>
            </Form>
          </div>
        </Col> */}
        <Col md='6'>
          <div className="admin-content-element">

        {/* <form onSubmit={handleSubmit}>
          <label htmlFor="name">
            Name
            <input
              required
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label htmlFor="bio">
            Bio
            <textarea
              id="bio"
              name="bio"
              type="text"
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </label>
          <label htmlFor="avatar">
            Profile picture
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/png, image/jpeg"
              ref={userData.profilePictureRef}
            />
          </label>
          <button disabled={isUpdating} type="submit">Save</button> */}
        {/* </form> */}



        <h4 className="mb-4">Definir nova senha</h4>
        <Form onSubmit={handleSubmitPasswordChange}>
          <Form.Group controlId="formOldPass">
            <Form.Label>Senha atual</Form.Label>
            <Form.Control
              type="password"
              placeholder="Senha atual"
              name="oldPassword"
              id="oldpassword"
            />
          </Form.Group>
          <Form.Group controlId="formNewPass">
            <Form.Label>Nova senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nova senha"
              name="newPassword"
              id="newpassword"
              required
            />
          </Form.Group>
          <Button variant="info" size='sm' type="submit">
            Salvar
          </Button>
        </Form>
        {/* <form onSubmit={handleSubmitPasswordChange}>
          <label htmlFor="oldpassword">
            Old Password
            <input
              type="password"
              name="oldPassword"
              id="oldpassword"
              required
            />
          </label>
          <label htmlFor="newpassword">
            New Password
            <input
              type="password"
              name="newPassword"
              id="newpassword"
              required
            />
          </label>
          <button type="submit">Change Password</button>
        </form> */}
      </div>
        </Col>
      </Row>
    </>
  )
}

export default EditProfile
