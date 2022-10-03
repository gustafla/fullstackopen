import React from 'react'

const Notification = ({ message, className }) => {
  if (message === null) return

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification
