import axios from 'axios';
// import { checkIfTokenNeedsRefresh } from "@/utils/utils.js";
// import { checkForUpdates } from "@/utils/updates.js";

axios.defaults.timeout = 20000;

axios.defaults.headers.common['Accept-Language'] =
  JSON.parse(localStorage.getItem('locale')) || 'es';

axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    // If request is different than any of the URLS in urlsExcludedForBearerHeader
    // then send Authorization header with token from localstorage
    const urlsExcludedForBearerHeader = [
      '/api/login',
      '/api/forgot',
      '/api/register',
      '/api/reset',
      `${window.location.origin}/version.json`,
    ];
    if (urlsExcludedForBearerHeader.indexOf(config.url) === -1) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Add a response interceptor
axios.interceptors.response.use(
  response => response,
  error => Promise.reject(error),
);
