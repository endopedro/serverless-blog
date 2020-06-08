import React, { useState, useEffect, useContext } from 'react'
import slugify from 'slugify'
import { Form, Button, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
// import draftToHtml from 'draftjs-to-html'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeatherAlt, faPencilAlt, faArrowCircleLeft, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { getPost } from '@lib/crud-helpers'
import { BlogContext } from '@contexts/blogContext'

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)

const NewPost = props => {
  const router = useRouter()
  const [state, dispatch] = useContext(BlogContext)
  const postThumbRef = React.createRef()
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [thumbName, setThumbName] = useState(null)
  const [tagsInput, setTagsInput] = useState('')
  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    _id: '',
    category: '',
    content: EditorState.createEmpty(),
    thumb: '',
    tags: [],
    method: 'POST'
  })

  const addTag = () => {
    if (tagsInput && !postForm.tags.includes(tagsInput)) {
      const tags = [...postForm.tags]
      tags.push(tagsInput)
      setPostForm({...postForm, tags: [...tags]})
      setTagsInput('')
    }
  }

  const removeTag = (tag) => {
    if(postForm.tags.includes(tag)) {
      const tags = [...postForm.tags]
      tags.splice(postForm.tags.indexOf(tag),1)
      setPostForm({...postForm, tags: tags})
    }
  }

  useEffect(() => {
    if(state.categories.length > 0 && !postForm.category) setPostForm({...postForm, category: state.categories[0]._id})
  }, [state.categories])

  const getPostToEdit = () => {
    const post = state.posts.find(post => post.slug == props.postSlug)
    if(post) {
      setPostForm({
        ...postForm,
        category: post.category ? state.categories.find(cat => cat.name == post.category)._id : state.categories[0]._id,
        content: EditorState.createWithContent(convertFromRaw((post.content))),
        slug: post.slug,
        tags: post.tags,
        thumb: post.thumb,
        title: post.title,
        _id: post._id,
        method: 'PATCH'
      })
    }
  }

  useEffect(() => {
    if(props.postSlug) getPostToEdit()
  }, [state.posts, props.postSlug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('title', postForm.title)
    formData.append('slug', postForm.slug)
    formData.append('_id', postForm._id)
    formData.append('category', postForm.category)
    formData.append('currentThumb', postForm.thumb)
    formData.append('tags', JSON.stringify(postForm.tags))
    formData.append('content', JSON.stringify(convertToRaw(postForm.content.getCurrentContent())))
    if (postThumbRef.current.files[0]) formData.append('thumb', postThumbRef.current.files[0])

    const res = await fetch('/api/posts', {
      method: postForm.method,
      body: formData,
    })
    if (res.status === 201) {
      const postObj = await res.json()
      if(postForm.method == 'POST') {
        insertPost(postObj)
        router.push(`/admin?posts=true`)
      }
      else updatePost(postForm.slug)
      setSuccessMsg(`Post ${postForm.method == "POST" ? 'criado' : 'editado'} com sucesso.`)
    } else {
      setErrorMsg(await res.text())
    }
  }

  const insertPost = (post) =>
    dispatch({ type: 'INSERT_POST', payload: post })

  const updatePost = async (slug) =>{
    const post = await getPost(slug)
    dispatch({ type: 'UPDATE_POST', payload: post })
  }

  // const handleEditor = (editorState) => {
  //   handlePostForm('content', editorState)
  // }

  const handlePostForm = (fieldName, value) => {
    // console.log(draftToHtml((convertToRaw(postForm.content.getCurrentContent()))))
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

        <Form.Row>
          <Form.Group as={Col} controlId="postCategory">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              as="select"
              value={postForm.category}
              onChange={e => handlePostForm('category', e.target.value)}
            >
              {state.categories.map((category,key)=>(
                <option key={key} value={category._id}>{category.name}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} controlId="postThumb">
            <Form.Label>Thumbnail</Form.Label>
            <Form.File
              id="postThumb"
              label={thumbName ? thumbName : "Selecione um arquivo"}
              accept="image/png, image/jpeg"
              type="file"
              ref={postThumbRef}
              onChange={(e) => setThumbName(e.target.value.split('\\').pop())}
              custom
            />
          </Form.Group>
        </Form.Row>

          <Form.Row className="align-items-center mb-3">
            <Col sm={3}>
            <Form.Label htmlFor="tags">Tags</Form.Label>
              <div className="d-flex">
                <Form.Control
                  id="tags"
                  size="sm"
                  placeholder="Digite a tag"
                  value={tagsInput}
                  onChange={e=>setTagsInput(e.target.value)}
                />
                <Button
                  variant="info"
                  size="sm"
                  className="mb-3"
                  onClick={addTag}
                >
                  <FontAwesomeIcon icon={faPlusCircle}/>
                </Button>
              </div>
              <div>
                {postForm.tags.map((tag,key) => <Button key={key} variant="info" size="sm" className="mr-2" onClick={()=>removeTag(tag)}>{tag}</Button>)}
              </div>
            </Col>
          </Form.Row>

        <Form.Label>Conteúdo</Form.Label>
        <Editor
          editorState={postForm.content}
          editorClassName="editor"
          onEditorStateChange={e => handlePostForm('content', e)}
        />

        <div className="mt-3 d-flex">
          <Link href="/admin?posts=true" passHref>
            <Button variant="dark" size={'sm'} onClick={props.goToPosts}><FontAwesomeIcon icon={faArrowCircleLeft} className="mr-2" />Cancelar</Button>
          </Link>
          {/* <Button variant="secondary" size={'sm'} className="ml-auto mr-3"><FontAwesomeIcon icon={faPencilAlt} className="mr-2"/>Salvar Rascunho</Button> */}
          <Button variant="info" size={'sm'} className="ml-auto mr-3" type="submit"><FontAwesomeIcon icon={faFeatherAlt} className="mr-2"/>Publicar</Button>
        </div>
      </Form>
    </div>
  )
}

export default NewPost
