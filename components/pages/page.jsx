import React from 'react'
import { Container } from 'react-bootstrap'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { useUser } from '@lib/hooks'

import EditPageIcon from '@components/editPageIcon'

const Page = (props) => {
  const [user, { mutate }] = useUser()
  const page = props.page
  const getContent = (content) => draftToHtml(convertToRaw(EditorState.createWithContent(convertFromRaw((content))).getCurrentContent()))

   return (
    <Container>
      {page && (
        <div className="single-page">
          {user && (<EditPageIcon type="Page" query={page.slug}/>)}
          {/* <h2 className="page-title">{page.title}</h2> */}
          <div className="page-content" dangerouslySetInnerHTML={{__html: getContent(page.content)}}></div>
        </div>
      )}
    </Container>
  )
}

export default Page
