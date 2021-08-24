import axios from 'axios'
import router from './router'

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api'
})

http.interceptors.response.use(res => {
  return res
}, err => {
  if (err.response.data.message) {
    // notify the user to login in case the token is invalid
    if (err.response.status >= 401) {
      router.push({ name: 'login', params: { message: err.response.data.message } })
    }
  }
  return Promise.reject(err)
})

http.interceptors.request.use(config => {
  if (sessionStorage.token) {
    config.headers.Authorization = `Bearer ${sessionStorage.token}`
  }
  return config
})

export default http
