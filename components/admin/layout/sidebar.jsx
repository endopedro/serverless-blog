import React from 'react'
import { Image } from 'cloudinary-react'
import Link from 'next/link'
import { useUser } from '@lib/hooks'

const cloudName = process.env.CLOUDINARY_NAME

const Sidebar = (props) => {
  const [user, { mutate }] = useUser()

  return (
    <div className="sidebar">
      <div className="sidebar-user">
        <Image
          cloudName={cloudName}
          className="user-image"
          publicId={user.profilePicture ? user.profilePicture : `${process.env.WEB_URI}/no-pic.jpg`}
        />
        <div className="user-info">
          <h6 className="user-name">{user.name}</h6>
          <h6 className="user-role">{user.role=='admin' ? 'Administrador' : 'Editor'}</h6>
        </div>
      </div>
      <div className="sidebar-section">AÇÕES</div>
      <Link href="/admin" passHref>
        <div className="sidebar-item">
          <span className="text-capitalize">Dashboard</span>
        </div>
      </Link>
      <Link href="/admin?posts=true" passHref>
        <div className="sidebar-item">
          <span className="text-capitalize">Posts</span>
        </div>
      </Link>
      <Link href="/admin?editProfile=true" passHref>
        <div className="sidebar-item">
          <span className="text-capitalize">Editar perfil</span>
        </div>
      </Link>
      {user.role=='admin' && (
        <Link href="/admin?editors=true" passHref>
        <div className="sidebar-item">
          <span className="text-capitalize">Editores</span>
        </div>
        </Link>
      )}
      <Link href="/admin?pages=true" passHref>
        <div className="sidebar-item">
          <span className="text-capitalize">Páginas</span>
        </div>
      </Link>
      <Link href="/admin?categories=true" passHref>
        <div className="sidebar-item">
          <span className="text-capitalize">Categorias</span>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar