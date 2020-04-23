import React from 'react'
import { Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons'

const Footer = (props) => (
  <footer className="footer">
    <Container>
      <h2>Serverless Blog</h2>
      <h6><a href="https://serverless.css-tricks.com/about/">O que é Serverless?</a></h6>
      <div className="footer-social">
        <a href="#" className="social-icon"><FontAwesomeIcon icon={faFacebook} /></a>
        <a href="#" className="social-icon"><FontAwesomeIcon icon={faTwitter} /></a>
        <a href="#" className="social-icon"><FontAwesomeIcon icon={faInstagram} /></a>
        <a href="#" className="social-icon"><FontAwesomeIcon icon={faGithub} /></a>
      </div>
    </Container>
  </footer>
)

export default Footer