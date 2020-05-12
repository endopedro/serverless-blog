import React, { useState } from 'react'
import { useUser } from '@lib/hooks'
import slugify from 'slugify'
import { Form, Button, Col } from 'react-bootstrap'

const NewPost = () => {
  const [user, { mutate }] = useUser()
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [postForm, setPostForm] = useState({
    user: user,
    date: new Date(),
    title: '',
    slug: '',
    category: '',
    content: '',
    clicks: 0,
    thumb: 'https://abduzeedo.com/sites/default/files/styles/home_cover/public/originals/abdz_infrared_arashiyama_mockup_0.jpg',
    tags: ["carros", "casas", "toalhas"],
    action: "create"
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    // const body = {
    //   user: user,
    //   date: new Date(),
    //   title: e.currentTarget.title.value,
    //   slug: slugify(e.currentTarget.slug.value),
    //   category: e.currentTarget.category.value,
    //   content: e.currentTarget.content.value,
    //   clicks: 0,
    //   thumb: e.currentTarget.thumb.value,
    //   tags: ["carros", "casas", "toalhas"],
    //   action: "create"
    // }
    const res = await fetch('/api/posts/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postForm),
    })
    if (res.status === 201) {
      const postObj = await res.json()
      setSuccessMsg("Post criado com sucesso.")
    } else {
      setErrorMsg(await res.text())
    }
  }

  const handlePostForm = (fieldName, value) => {
    setPostForm(prevState => ({
      ...prevState,
      [fieldName]: value
    }))
  }

  const handleSlugify = str => (
    slugify(str, {
      replacement: '-',  // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true,      // convert to lower case, defaults to `false`
      strict: true,     // strip special characters except replacement, defaults to `false`
    })
  )

  return (
    <div className="admin-content-element">
      <Form onSubmit={handleSubmit}>
        {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
        {successMsg ? <p style={{ color: 'green' }}>{successMsg}</p> : null}

        <Form.Group controlId="postTitle" className="mb-0">
          <Form.Label>Título</Form.Label>
          <Form.Control
            placeholder="Digite o título do post"
            onChange={e => {
              handlePostForm('title', e.target.value)
              handlePostForm('slug', handleSlugify(e.target.value))
            }}
            value={postForm.title}
          />
        </Form.Group>
        <p>Slug: <span className="text-primary">{postForm.slug ? '/'+postForm.slug : ''}</span></p>
        {/* <Form.Group controlId="postSlug">
          <Form.Label>Slug</Form.Label>
          <Form.Control
            placeholder="Slug do post"
            onChange={e => handlePostForm('slug', slugify(e.target.value))}
            value={postForm.slug}
            size="sm"
          />
        </Form.Group> */}

        <Form.Row>
          <Form.Group as={Col} controlId="postCategory">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              as="select"
              value={postForm.category}
              onChange={e => handlePostForm('category', e.target.value)}
            >
              <option>Escolha uma categoria</option>
              <option>Design</option>
              <option>Tecnologia</option>
              <option>Arquitetura</option>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} controlId="postCategory">
            <Form.Label>Thumbnail</Form.Label>
            <Form.File
              id="postThumb"
              label="Escolha uma imagem"
              data-browse="Upload"
              custom
            />
          </Form.Group>
        </Form.Row>

        <Form.Group controlId="postCOntent">
          <Form.Label>Post</Form.Label>
          <Form.Control
            as="textarea"
            rows="10"
            value={postForm.content}
            onChange={e => handlePostForm('content', e.target.value)}
          />
        </Form.Group>

        <Button variant="info" type="submit">Publicar</Button>
        <Button variant="secondary" className="ml-3">Salvar rascunho</Button>
      </Form>
        {/* <form onSubmit={handleSubmit}>
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
        </form> */}
    </div>
  )
}

export default NewPost
