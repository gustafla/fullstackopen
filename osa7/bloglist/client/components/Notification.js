import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

const Notification = ({ className, message, setMessage }) => {
  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(null), 5000)
    }
  }, [message, setMessage])

  if (message === null) return

  return <div className={`notification ${className}`}>{message}</div>
}

Notification.propTypes = {
  className: PropTypes.string.isRequired,
  message: PropTypes.string,
  setMessage: PropTypes.func.isRequired,
}

export default Notification
