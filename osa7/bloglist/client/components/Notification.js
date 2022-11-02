import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Toast } from 'react-bootstrap'
import { clearError, clearSuccess } from '../reducers/notificationReducer'

const Notification = ({ variant }) => {
  const dispatch = useDispatch()

  const notification = useSelector(({ notification }) =>
    variant === 'success' ? notification.success : notification.error,
  )
  const message = notification.text

  const onClose = () => {
    dispatch(variant === 'success' ? clearSuccess() : clearError())
  }

  if (message) {
    return (
      <Toast onClose={onClose}>
        <Toast.Header>{variant}</Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    )
  }
}

Notification.propTypes = {
  variant: PropTypes.string.isRequired,
}

export default Notification
