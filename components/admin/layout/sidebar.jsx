import React from 'react'

const Sidebar = (props) => {
  return (
    <div className="sidebar">
      {Object.keys(props.actions).map((action, index) => (
        <div 
          className="sidebar-item" 
          key={index} 
          onClick={() => props.handleActions(action)}
        >
          {props.actions[action].label}
        </div>
      ))}
    </div>
  )
}

export default Sidebar