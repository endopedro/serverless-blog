import React, { useState } from 'react'
import { Image } from 'cloudinary-react'
const cloudName = process.env.CLOUDINARY_NAME
import ClickOutHandler from 'react-clickout-handler'
import Link from 'next/link'

const MenuDropDown = (props) => {
  const [showDropDown, setShowDropDown] = useState(false)

  const dropdownClass = showDropDown ? "dropdown" : "dropdown hide"

  const handleClickOut = () => {
    setShowDropDown(false)
  }

  return (
    <ClickOutHandler onClickOut={handleClickOut}>
      <div className="menu-dropdown d-none d-md-block">
        <div className="picture" onClick={()=>setShowDropDown(!showDropDown)} >
          <Image 
            cloudName={cloudName} 
            publicId={props.user.profilePicture} 
            className="user-image" 
            />
        </div>
        <div className={dropdownClass}>
          <Link href="/admin"><span className="dropdown-item">Administração</span></Link>
          <Link href="/profile"><span className="dropdown-item pb-2">Perfil</span></Link>
          <div class="dropdown-divider m-0" role="separator"></div>
          <span className="dropdown-item pt-2" onClick={props.handleLogout}>Sair</span>
        </div>
      </div>
    </ClickOutHandler>
  )
}

export default MenuDropDown