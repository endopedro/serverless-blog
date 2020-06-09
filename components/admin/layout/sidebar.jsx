import React, { useEffect, useState } from 'react'
import { Image } from 'cloudinary-react'
import Link from 'next/link'
import { useUser } from '@lib/hooks'
import _ from 'lodash'

const cloudName = process.env.CLOUDINARY_NAME

const Sidebar = (props) => {
  const [user, { mutate }] = useUser()
  const [activePage, setActivePage] = useState('')

  useEffect(() => {
    if(props.title=='Posts'||props.title=='Novo Post'||props.title=='Editar Post') setActivePage('posts')
    else if(props.title=='Editar Perfil') setActivePage('editProfile')
    else if(props.title=='Editores'||props.title=='Novo Editor'||props.title=='Editar Editor') setActivePage('editors')
    else if(props.title=='Páginas'||props.title=='Nova Página'||props.title=='Editar Página') setActivePage('pages')
    else if(props.title=='Categorias') setActivePage('categories')
    else setActivePage('dashboard')
  }, [props.title])

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
        <div className={`sidebar-item${activePage=='dashboard' ? ' active' : ''}`}>
          <span className="text-capitalize">Dashboard</span>
        </div>
      </Link>
      <Link href="/admin?posts=true" passHref>
        <div className={`sidebar-item${activePage=='posts' ? ' active' : ''}`}>
          <span className="text-capitalize">Posts</span>
        </div>
      </Link>
      <Link href="/admin?pages=true" passHref>
        <div className={`sidebar-item${activePage=='pages' ? ' active' : ''}`}>
          <span className="text-capitalize">Páginas</span>
        </div>
      </Link>
      {user.role=='admin' && (
        <Link href="/admin?editors=true" passHref>
        <div className={`sidebar-item${activePage=='editors' ? ' active' : ''}`}>
          <span className="text-capitalize">Editores</span>
        </div>
        </Link>
      )}
      <Link href="/admin?categories=true" passHref>
        <div className={`sidebar-item${activePage=='categories' ? ' active' : ''}`}>
          <span className="text-capitalize">Categorias</span>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar