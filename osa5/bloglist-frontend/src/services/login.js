import axios from 'axios'
const baseUrl = '/api/login'

let notificationControl = null

const setNotificationControl = (newNotificationControl) => {
  notificationControl = newNotificationControl
}

const login = async credentials => {
  try {
    const response = await axios.post(baseUrl, credentials)
    return response.data
  } catch (exception) {
    notificationControl.setError(exception.response.data.error)
    return Promise.reject(exception)
  }
}

export default { setNotificationControl, login }
