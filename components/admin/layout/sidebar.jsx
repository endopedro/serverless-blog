import React from 'react'
import { useRouter } from 'next/router'
import {Image} from 'cloudinary-react'

const cloudName = process.env.CLOUDINARY_NAME

const Sidebar = (props) => {
  const router = useRouter()

  return (
    <div className="sidebar">
      <div className="sidebar-user">
        <Image cloudName={cloudName} className="user-image" publicId={props.user.profilePicture} />
        <div className="user-info">
          <h6 className="user-name">{props.user.name}</h6>
          <h6 className="user-role">Administrador</h6>
        </div>
      </div>
      <div className="sidebar-section">AÇÕES</div>
      {props.pages.map((page, index) => (
        <div
          className={`sidebar-item${page == props.activePage ? ' active' : ''}`}
          key={index}
          onClick={() => {
            router.push(`/admin?page=${page}`, undefined, { shallow: true })
            props.handlePages(page)
          }}>
          <span className="text-capitalize">{page}</span>
        </div>
      ))}
    </div>
  )
}

export default Sidebar