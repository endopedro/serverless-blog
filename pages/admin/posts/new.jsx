import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import { useUser } from '@lib/hooks'
import slugify from 'slugify'

const NewPost = () => {
  const [user, { mutate }] = useUser()
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // useEffect(() => {
  //   redirect to home if user is not authenticated
  //   if (!user) Router.push('/login')
  // }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = {
      user: user,
      date: new Date(),
      title: e.currentTarget.title.value,
      slug: slugify(e.currentTarget.slug.value),
      category: e.currentTarget.category.value,
      content: e.currentTarget.content.value,
      clicks: 0,
      thumb: e.currentTarget.thumb.value,
      tags: ["carros", "casas", "toalhas"],
      action: "create"
    }
    const res = await fetch('/api/posts/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status === 201) {
      const postObj = await res.json()
      setSuccessMsg("Post criado com sucesso.")
    } else {
      setErrorMsg(await res.text())
    }
  }

  if (!user) return "You're Not logged in."

  return (
    <>
      <Head>
        <title>Novo post</title>
      </Head>
      <div>
        <h2>Novo Post</h2>
        <form onSubmit={handleSubmit}>
          {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
          {successMsg ? <p style={{ color: 'green' }}>{successMsg}</p> : null}
          <label htmlFor="title">
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Título"
            />
          </label>
          <label htmlFor="slug">
            <input
              id="slug"
              name="slug"
              type="text"
              placeholder="Slug"
            />
          </label>
          <label htmlFor="category">
            <input
              id="category"
              name="category"
              type="text"
              placeholder="Categoria"
            />
          </label>
          <label htmlFor="thumb">
            <input
              id="thumb"
              name="thumb"
              type="text"
              placeholder="thumb"
            />
          </label>
          <label htmlFor="content">
            <input
              id="content"
              name="content"
              type="text"
              placeholder="content"
            />
          </label>
          <button type="submit">Publicar</button>
        </form>
      </div>
    </>
  )
}

export default NewPost
