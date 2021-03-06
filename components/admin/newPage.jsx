import React, { useState, useEffect, useContext } from 'react'
import slugify from 'slugify'
import { Form, Button, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeatherAlt, faPencilAlt, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { getPage } from '@lib/crud-helpers'
import { BlogContext } from '@contexts/blogContext'

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)

const NewPage = props => {
  const [state, dispatch] = useContext(BlogContext)
  const router = useRouter()
  const pageThumbRef = React.createRef()
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [thumbName, setThumbName] = useState(null)
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    _id: '',
    content: EditorState.createEmpty(),
    thumb: '',
    method: 'POST'
  })

  const getPageToEdit = () => {
    const page = state.pages.find(page => page.slug == props.pageSlug)
    if(page) {
      setPageForm({
        ...pageForm,
        content: EditorState.createWithContent(convertFromRaw((page.content))),
        slug: page.slug,
        thumb: page.thumb,
        title: page.title,
        _id: page._id,
        method: 'PATCH'
      })
    }
  }

  useEffect(() => {
    if(props.pageSlug) getPageToEdit()
  }, [state.pages, props.pageSlug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('title', pageForm.title)
    formData.append('slug', pageForm.slug)
    formData.append('_id', pageForm._id)
    formData.append('currentThumb', pageForm.thumb)
    formData.append('content', JSON.stringify(convertToRaw(pageForm.content.getCurrentContent())))
    if (pageThumbRef.current.files[0]) formData.append('thumb', pageThumbRef.current.files[0])

    const res = await fetch('/api/posts?page=true', {
      method: pageForm.method,
      body: formData,
    })
    if (res.status === 201) {
      const pageObj = await res.json()
      if(pageForm.method == 'POST') {
        insertPage(pageObj)
        router.push(`/admin?pages=true`)
      }
      else updatePage(pageForm.slug)
      setSuccessMsg(`Page ${pageForm.method == "POST" ? 'criada' : 'editada'} com sucesso.`)
    } else {
      setErrorMsg(await res.text())
    }
  }

  const insertPage = (page) =>
    dispatch({ type: 'INSERT_PAGE', payload: page })

  const updatePage = async (slug) =>{
    const page = await getPage(slug)
    dispatch({ type: 'UPDATE_PAGE', payload: page })
  }

  const handlePageForm = (fieldName, value) => {
    setPageForm(prevState => ({
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

        <Form.Group controlId="pageTitle" className="mb-0">
          <Form.Label>Título</Form.Label>
          <Form.Control
            placeholder="Digite o título da página"
            onChange={e => {
              handlePageForm('title', e.target.value)
              handlePageForm('slug', handleSlugify(e.target.value))
            }}
            value={pageForm.title}
          />
        </Form.Group>
        <p>Slug: <span className="text-primary">{pageForm.slug ? '/'+pageForm.slug : ''}</span></p>

        <Form.Group controlId="postCategory">
          <Form.Label>Thumbnail</Form.Label>
          <Form.File
            id="postThumb"
            label={thumbName ? thumbName : "Selecione um arquivo"}
            accept="image/png, image/jpeg"
            type="file"
            ref={pageThumbRef}
            onChange={(e) => setThumbName(e.target.value.split('\\').pop())}
            custom
          />
        </Form.Group>

        <Editor
          editorState={pageForm.content}
          editorClassName="editor"
          onEditorStateChange={e => handlePageForm('content', e)}
        />

        <div className="mt-3 d-flex">
          <Link href="/admin?pages=true" passHref>
            <Button variant="dark" size={'sm'}><FontAwesomeIcon icon={faArrowCircleLeft} className="mr-2" />Cancelar</Button>
          </Link>
          {/* <Button variant="secondary" size={'sm'} className="ml-auto mr-3"><FontAwesomeIcon icon={faPencilAlt} className="mr-2"/>Salvar Rascunho</Button> */}
          <Button variant="info" size={'sm'} className="ml-auto mr-3" type="submit"><FontAwesomeIcon icon={faFeatherAlt} className="mr-2"/>Publicar</Button>
        </div>
      </Form>
    </div>
  )
}

export default NewPage
