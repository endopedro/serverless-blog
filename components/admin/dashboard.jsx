import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BlogContext } from '@contexts/blogContext'
import _ from 'lodash'
import ReactLoading from 'react-loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeatherAlt, faCalendarAlt, faEye, faTags, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

const Page = (props) => {
  const [state, dispatch] = useContext(BlogContext)
  const [mostViewed, setMostViewed] = useState(null)
  const [lastPost, setLastPost] = useState(null)
  const [totalViews, setTotalViews] = useState(null)
  const [totalPosts, setSotalPosts] = useState(null)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    if(state.posts.length > 0) {
      setMostViewed(_.orderBy(state.posts, 'clicks', 'desc')[0])
      setLastPost(_.orderBy(state.posts, 'date', 'asc')[0])
      setTotalViews(_.sumBy(state.posts, 'clicks'))
      setSotalPosts(state.posts.length)
      setIsLoading(false)
    }
  }, [state.posts])

  if(isLoading) return <div className="admin-loading"><ReactLoading type="spin" color="#0D7EA6" className="my-5"/></div>

  return (
    <Row>
      <Col md={6} lg={2}>
        <div className="admin-content-element metric">
          <h4 className="content-title">Views</h4>
          <h4 className="content-text text-center">{totalViews}</h4>
        </div>
      </Col>
      <Col md={6} lg={2}>
        <div className="admin-content-element metric">
          <h4 className="content-title">Posts</h4>
          <h4 className="content-text text-center">{totalPosts}</h4>
        </div>
      </Col>
      <Col md={6} lg={4}>
        <div className="admin-content-element metric">
          <h4 className="content-title">Última postagem</h4>
          <div className="metric-element">
            <h5 className="content-text">“{lastPost.title}”</h5>
          </div>
          <div className="metric-element">
            <FontAwesomeIcon className="content-icon" icon={faEye} />
            <h5 className="content-text m-0">{lastPost.clicks}</h5>
          </div>
        </div>
      </Col>
      <Col md={6} lg={4}>
        <div className="admin-content-element metric">
          <h4 className="content-title">Post mais visto</h4>
          <div className="metric-element">
            <h5 className="content-text">“{mostViewed.title}”</h5>
          </div>
          <div className="metric-element">
            <FontAwesomeIcon className="content-icon" icon={faEye} />
            <h5 className="content-text m-0">{mostViewed.clicks}</h5>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default Page
