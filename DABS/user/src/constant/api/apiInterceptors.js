import axios from 'axios';
import { isTokenExpired } from '../utils/token';
import store from '../store';
import { refreshToken as refreshTokenThunk, logout } from '../features/auth/authSlice';

const api = axios.create({ /* ... */ });

api.interceptors.request.use(async (config) => {
  let token = store.getState().auth.accessToken;
  if (token && isTokenExpired(token)) {
    try {
      // Gọi action refresh token (có thể dùng thunk hoặc hàm thường)
      token = await store.dispatch(refreshTokenThunk()).unwrap();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      store.dispatch(logout());
      throw new axios.Cancel('Session expired');
    }
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
