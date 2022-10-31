import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

const Notification = ({ className }) => {
  const notification = useSelector(({ notification }) =>
    className === 'success' ? notification.success : notification.error,
  )
  const message = notification.text

  if (message) {
    return <div className={`notification ${className}`}>{message}</div>
  }
}

Notification.propTypes = {
  className: PropTypes.string.isRequired,
}

export default Notification
