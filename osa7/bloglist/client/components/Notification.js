import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

const Notification = ({ className }) => {
  const notification = useSelector((state) =>
    className === 'success'
      ? state.notification.success
      : state.notification.error,
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
