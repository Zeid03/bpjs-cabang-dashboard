// frontend/src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // atau dari context
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// frontend/src/api/axios.js
// import axios from 'axios';

// const runtimeBase = `${window.location.origin}/api`;

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || runtimeBase,
//   withCredentials: false,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;

