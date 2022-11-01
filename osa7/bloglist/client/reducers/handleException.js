import { notifyError } from './notificationReducer'
import { logOut } from './sessionReducer'

const handleException = (dispatch, exception, message) => {
  const error = exception.response.data.error
  if (error) {
    if (error.includes('expired')) {
      dispatch(logOut())
    }
    dispatch(notifyError(`${message}: ${error}`, 5))
  } else {
    dispatch(notifyError(message, 5))
  }
}

export default handleException
