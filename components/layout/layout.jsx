import React from 'react'

import SiteHead from '@components/layout/siteHead'
import MainNav from '@components/layout/mainNav'
import Footer from '@components/layout/footer'

import '@assets/styles/main.scss'

export default ({ children }) => {
  return (
    <>
      <SiteHead />
      <MainNav />
      <main>{children}</main>
      <Footer />
    </>
  )
}