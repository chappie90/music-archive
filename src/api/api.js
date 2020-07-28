import axios from 'axios';

const instance = axios.create({
  // baseURL: process.env.REACT_APP_DISCOGS_BASE_URL
  baseURL: 'http://206.189.126.134'
});

instance.CancelToken = axios.CancelToken;
instance.isCancel = axios.isCancel;

instance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;