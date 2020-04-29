import React from 'react'

import SiteHead from '@components/layout/siteHead'
import Header from '@components/layout/header'
import MainNav from '@components/layout/mainNav'
import Footer from '@components/layout/footer'

import '@assets/styles/main.scss'

export default ({ children }) => {
  return (
    <>
      <SiteHead />
      <Header>
        <MainNav />
      </Header>
      <main className="page">{children}</main>
      <Footer />
    </>
  )
}