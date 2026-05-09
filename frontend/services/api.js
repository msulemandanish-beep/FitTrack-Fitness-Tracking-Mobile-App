import axios from 'axios';

// Change this to your machine's local IP when testing on a physical device
// For emulator: http://10.0.2.2:5000/api (Android)
// For simulator: http://localhost:5000/api (iOS)
// For physical device: http://YOUR_LOCAL_IP:5000/api
const BASE_URL = 'http://192.168.0.105:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
