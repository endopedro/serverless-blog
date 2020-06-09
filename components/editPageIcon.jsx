import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

const EditPageIcon = props => (
  <Link href={`/admin?edit${props.page ? 'Page' : 'Post'}=${props.slug}`} passHref>
    <div className="edit-page-icon"><FontAwesomeIcon icon={faPencilAlt} className="edit-icon" /></div>
  </Link>
)

export default EditPageIcon