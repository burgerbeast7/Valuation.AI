import axios from 'axios';

// Create central Axios instance
// Base URL points to relative path /api which is proxied in development,
// and served directly or via proxy in production container setups.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
