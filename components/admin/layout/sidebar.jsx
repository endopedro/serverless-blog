import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'

const Sidebar = (props) => {
  return (
    <div className="sidebar">
      <div className="sidebar-user">
        <Image className="user-image" src={props.user.profilePicture} />
        <div className="user-info">
          <h6 className="user-name">{props.user.name}</h6>  
          <h6 className="user-role">Administrador</h6>
        </div>
      </div>
      <div className="sidebar-section">AÇÕES</div>
      {props.actions.map((action, index) => (
        <div 
          className={`sidebar-item${action.label == props.activeAction.label ? ' active' : ' lalala'}`}
          key={index} 
          onClick={() => props.handleActions(action)}
        >
          {action.label}
        </div>
      ))}
    </div>
  )
}

export default Sidebar