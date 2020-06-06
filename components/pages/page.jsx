import React, { useContext } from 'react'
import { Container } from 'react-bootstrap'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

import { BlogContext } from '@contexts/blogContext'

const Page = () => {
  const [state, dispatch] = useContext(BlogContext)
  const page = state.activePage
  const content = draftToHtml(convertToRaw(EditorState.createWithContent(convertFromRaw((page.content))).getCurrentContent()))

   return (
    <Container>
      <div className="single-page">
        {/* <h2 className="page-title">{page.title}</h2> */}
        <div className="page-content" dangerouslySetInnerHTML={{__html: content}}></div>
      </div>
    </Container>
  )
}

export default Page
