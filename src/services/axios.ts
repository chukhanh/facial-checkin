import axios, { AxiosError } from 'axios';
import CookiesServices from './cookies-services';

const axiosBase = axios.create();

if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_ENV === 'production') {
  axiosBase.defaults.baseURL = `https://${process.env.REACT_APP_API}/api`;
} else {
  axiosBase.defaults.baseURL = `https://${process.env.REACT_APP_API}/api`;
}

axiosBase.interceptors.request.use(request => {
  const token = CookiesServices.getCookies('token');
  if (token) {
    request.headers.common.Authorization = `Bearer ${token}`;
  }
  return request;
});

axiosBase.interceptors.response.use(
  response => {
    if (response.data.code !== 1000) {
      return Promise.reject(response.data ? response.data : response);
    }

    // Token expired
    if (response.data.code === 1007) {
      //Refresh token
    }

    if (!response.data?.data && response.data.code !== 1000) {
      return Promise.reject(response.data);
    }

    return response;
  },

  (error: AxiosError) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    if (error.request) {
      console.log('No response, error request:', error.request);
    } else {
      console.log('Axios error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosBase;
