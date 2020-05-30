import React from 'react'
import { useRouter } from 'next/router'
import { Image } from 'cloudinary-react'
import { Image as Image2 } from 'react-bootstrap'

const cloudName = process.env.CLOUDINARY_NAME

const Sidebar = (props) => {
  const router = useRouter()

  return (
    <div className="sidebar">
      <div className="sidebar-user">
          <Image 
            cloudName={cloudName} 
            className="user-image" 
            publicId={props.user.profilePicture ? props.user.profilePicture : `${process.env.WEB_URI}/no-pic.jpg`}  
          />
        <div className="user-info">
          <h6 className="user-name">{props.user.name}</h6>
          <h6 className="user-role">{props.user.role=='admin' ? 'Administrador' : 'Editor'}</h6>
        </div>
      </div>
      <div className="sidebar-section">AÇÕES</div>
      {props.pages.map((page, index) => {
        if(props.user.role!='admin'&&page=='editors') return
        else return (
          <div
            className={`sidebar-item${page == props.activePage ? ' active' : ''}`}
            key={index}
            onClick={() => {
              router.push(`/admin?page=${page}`, undefined, { shallow: true })
              props.handlePages(page)
            }}>
            <span className="text-capitalize">{page}</span>
          </div>
        )
      })}
    </div>
  )
}

export default Sidebar