import { useRouter } from 'vue-router';
import axios from 'axios'
import { getLocalData, removeLocalData } from '@/utils/localdata';

const router = useRouter();
const $api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: true,
  // timeout: 1000,
  headers: {'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'}
  })


  // ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
  $api.interceptors.request.use(async (config) => {
    // Retrieve token from localStorage
    const token = await getLocalData('authToken')

    // If token is found
    if (token) {
      // Get request headers and if headers is undefined assign blank object
      config.headers = config.headers || {}

      // Set authorization header
      // ℹ️ JSON.parse will convert token to string
      config.headers.Authorization = token ? `Bearer ${JSON.parse(token)}` : ''
    }

    // Return modified config
    return config
  })

  // ℹ️ Add response interceptor to handle 401 response
  $api.interceptors.response.use(response => {
    return response
  }, error => {
    // Handle error
    if (error.response.status === 401) {
      // ℹ️ Logout user and redirect to login page
      // Remove "userData" from localStorage
      removeLocalData('userData', null)

      removeLocalData('authToken', null)

      // If 401 response returned from api
      //router.push('/auth/login')
      window.location = "/auth/login"
    }
    else {
      return Promise.reject(error)
    }
})
export default $api
