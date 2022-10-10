import { useEffect } from 'react'

const Notification = ({ className, message, setMessage }) => {
  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(null), 5000)
    }
  }, [message, setMessage])

  if (message === null) return

  return (
    <div className={`notification ${className}`}>{message}</div>
  )
}

export default Notification
