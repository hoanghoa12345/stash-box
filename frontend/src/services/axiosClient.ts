import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthService } from './AuthService';
import { FailedRequest } from '@/types';
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_AUTHORIZE_TOKEN}`,
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers['X-User-Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// let isRefreshing = false
// let failedQueue: FailedRequest[] = []

// function processQueue(error: unknown, token: string = "") {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error)
//     } else {
//       prom.resolve(token)
//     }
//   })
//   failedQueue = []
// }

// axiosClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (!error.response || error.response.status !== 401) {
//       return Promise.reject(error)
//     }

//     const originalRequest = error.config

//     const refreshToken = Cookies.get("refresh_token")
//     if (!refreshToken) {
//       return Promise.reject(error)
//     }

//     if (originalRequest._retry) {
//       // Prevent infinite loops
//       return Promise.reject(error)
//     }

//     originalRequest._retry = true

//     if (isRefreshing) {
//       // If already refreshing, queue the request
//       return new Promise((resolve, reject) => {
//         failedQueue.push({
//           resolve: (token: string | null) => {
//             originalRequest.headers["X-User-Authorization"] = `Bearer ${token}`
//             resolve(axios(originalRequest))
//           },
//           reject
//         })
//       })
//     }

//     isRefreshing = true

//     try {
//       const data = await AuthService.refreshToken(refreshToken)

//       const newAccessToken = data.data.session.access_token

//       Cookies.set("access_token", newAccessToken, { expires: 1 })
//       Cookies.set("refresh_token", data.data.session.refresh_token, {
//         expires: 30
//       })
//       Cookies.set("expires_in", data.data.session.expires_in.toString(), {
//         expires: 1
//       })
//       Cookies.set("expires_at", data.data.session.expires_at.toString(), {
//         expires: 1
//       })

//       processQueue(null, newAccessToken)

//       originalRequest.headers["X-User-Authorization"] =
//         `Bearer ${newAccessToken}`
//       return axios(originalRequest)
//     } catch (err) {
//       processQueue(err, "")
//       return Promise.reject(err)
//     } finally {
//       isRefreshing = false
//     }
//   }
// )

export default axiosClient;
