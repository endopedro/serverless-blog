import React, { useState, useEffect } from 'react'
import { useUser } from '@lib/hooks'
import slugify from 'slugify'
import { Form, Button, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeatherAlt, faPencilAlt, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons'

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)

const NewPost = props => {
  const [user, { mutate }] = useUser()
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [postForm, setPostForm] = useState({
    user: user,
    date: new Date(),
    title: '',
    slug: '',
    category: '',
    content: EditorState.createEmpty(),
    clicks: 0,
    thumb: 'https://abduzeedo.com/sites/default/files/styles/home_cover/public/originals/abdz_infrared_arashiyama_mockup_0.jpg',
    tags: ["carros", "casas", "toalhas"],
    action: "create"
  })

  useEffect(() => {
    if(props.selectedPost) {
      setPostForm({
        ...postForm,
        author: props.selectedPost.author,
        category: props.selectedPost.category,
        clicks: props.selectedPost.clicks,
        content: EditorState.createWithContent(convertFromRaw((props.selectedPost.content))),
        date: props.selectedPost.date,
        slug: props.selectedPost.slug,
        tags: props.selectedPost.tags,
        thumb: props.selectedPost.thumb,
        title: props.selectedPost.title,
        _id: props.selectedPost._id,
        action: "edit"
      })
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    let data = {...postForm}
    data.content = convertToRaw(postForm.content.getCurrentContent())
    const res = await fetch('/api/posts/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.status === 201) {
      const postObj = await res.json()
      setSuccessMsg("Post criado com sucesso.")
    } else {
      setErrorMsg(await res.text())
    }
  }

  const handleEditor = (editorState) => {
    handlePostForm('content', editorState)
  }

  const handlePostForm = (fieldName, value) => {
    console.log(draftToHtml((convertToRaw(postForm.content.getCurrentContent()))))
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

        {/* <Form.Group controlId="postCOntent">
          <Form.Label>Post</Form.Label>
          <Form.Control
            as="textarea"
            rows="10"
            value={postForm.content}
            onChange={e => handlePostForm('content', e.target.value)}
          />
        </Form.Group> */}

        <Editor
          editorState={postForm.content}
          // wrapperClassName="demo-wrapper"
          editorClassName="editor"
          onEditorStateChange={e => handlePostForm('content', e)}
        />

        <div className="mt-3 d-flex">
          <Button variant="dark" size={'sm'} onClick={props.goToPosts}><FontAwesomeIcon icon={faArrowCircleLeft} className="mr-2" />Cancelar</Button>
          <Button variant="secondary" size={'sm'} className="ml-auto mr-3"><FontAwesomeIcon icon={faPencilAlt} className="mr-2"/>Salvar Rascunho</Button>
          <Button variant="info" size={'sm'} type="submit"><FontAwesomeIcon icon={faFeatherAlt} className="mr-2"/>Publicar</Button>
        </div>
      </Form>
    </div>
  )
}

export default NewPost
