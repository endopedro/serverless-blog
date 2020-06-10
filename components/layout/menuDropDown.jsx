import React, { useState } from 'react'
import { Image } from 'cloudinary-react'
const cloudName = process.env.CLOUDINARY_NAME
import ClickOutHandler from 'react-clickout-handler'
import Link from 'next/link'
import { useUser } from '@lib/hooks'
import { useRouter } from 'next/router'

const MenuDropDown = (props) => {
  const [showDropDown, setShowDropDown] = useState(false)
  const [user, { mutate }] = useUser()
  const router = useRouter()

  const dropdownClass = showDropDown ? "dropdown" : "dropdown hide"

  const handleClickOut = () => {
    setShowDropDown(false)
  }

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'DELETE',
    })
    mutate(null)
    if(props.admin) router.push('/')
  }

  return (
    <ClickOutHandler onClickOut={handleClickOut}>
      <div className="menu-dropdown d-none d-md-block">
        <div className="picture" onClick={()=>setShowDropDown(!showDropDown)} >
          {user && (
            <Image
              cloudName={cloudName}
              publicId={user.profilePicture ? user.profilePicture : `${process.env.WEB_URI}/no-pic.jpg`}
              className="user-image"
              />
          )}
        </div>
        <div className={dropdownClass}>
          {props.admin ? (
            <>
              <Link href="/admin?editProfile=true"><span className="dropdown-item pb-2">Editar Perfil</span></Link>
              <div className="dropdown-divider m-0" role="separator"></div>
            </>
          ) : (
            <>
              <Link href="/admin"><span className="dropdown-item">Administração</span></Link>
              <Link href={`/?profile=${user._id}`}><span className="dropdown-item pb-2">Perfil</span></Link>
              <div className="dropdown-divider m-0" role="separator"></div>
            </>
          )}
          <span className="dropdown-item pt-2" onClick={handleLogout}>Sair</span>
        </div>
      </div>
    </ClickOutHandler>
  )
}

export default MenuDropDown