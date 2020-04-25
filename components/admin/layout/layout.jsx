import React from 'react'

import SiteHead from '@components/admin/layout/siteHead'

import '@assets/styles/main.scss'

export default ({ children }) => {
  return (
    <>
      <SiteHead />
      <main>{children}</main>
    </>
  )
}
