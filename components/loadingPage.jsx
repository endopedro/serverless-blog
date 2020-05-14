import React from 'react'
import ReactLoading from 'react-loading'

const LoadingPage = () => {

  return (
    <div className="loading-page">
      <ReactLoading type="spokes" color="#fff" className="spokes" />
      <h1 className="loading-text">CARREGANDO</h1>
    </div>
  )
}

export default LoadingPage