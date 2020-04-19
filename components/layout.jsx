import React from 'react'
import MainNav from '@components/mainNav'

export default ({ children }) => {
  return (
    <>
      <MainNav />
      <div>
        <main>{children}</main>
      </div>
    </>
  )
}