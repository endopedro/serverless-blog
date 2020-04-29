import React from 'react'

import SiteHead from '@components/layout/siteHead'

import '@assets/styles/main.scss'

export default ({ children }) => {
  return (
    <>
      <SiteHead />
      <main className="login">
        <div className="login-box">
          {children}
        </div>
      </main>
    </>
  )
}