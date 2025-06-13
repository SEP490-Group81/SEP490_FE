
// import { isTokenExpired } from './jwtUtils';
// import { refreshToken as refreshTokenThunk, logout } from '../redux/slices/userSlice';

// export const getAuthHeader = async () => {
//   let token = store.getState().auth.accessToken;

//   if (!token || isTokenExpired(token)) {
//     try {
//       const result = await store.dispatch(refreshTokenThunk()).unwrap();
//       token = result.accessToken;
//     } catch (err) {
//       store.dispatch(logout());
//       throw new Error('Session expired');
//     }
//   }

//   return { Authorization: `Bearer ${token}` };
// };
