import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteCookie, storeTokens, getCookie } from '../../utils/cookieSettings';
import { fetchToken, refreshToken as refreshTokenService } from '../../services/authService';
import { decodeToken, setCookieWithExpiryFromToken } from '../../utils/jwtUtils';
import { getUserById } from '../../services/userService';
import CryptoJS from 'crypto-js';
import { my_secret_key } from '../../constant/CryptoJS/secretKey';
export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const refreshTokenValue = getCookie('refreshToken');
            let accessToken = getCookie('accessToken');
            if (!accessToken) {
                const encryptedToken = localStorage.getItem('encryptedToken');
                if (encryptedToken) {
                    const bytes = CryptoJS.AES.decrypt(encryptedToken, my_secret_key);
                    accessToken = bytes.toString(CryptoJS.enc.Utf8);
                }
            }
            console.log("refreshTokenValue is " + refreshToken + " accessToken is " + accessToken);
            if (!refreshTokenValue || !accessToken) {
                dispatch(logout());
                throw new Error('No refresh token found');
            }

            const tokenData = await refreshTokenService(accessToken, refreshTokenValue);
            const decoded = decodeToken(tokenData.token);
            if (!decoded) throw new Error('Token decoding failed');
            setCookieWithExpiryFromToken('accessToken', tokenData.token, dispatch);
            storeTokens(tokenData.refreshToken, tokenData.refreshTokenExpiryTime);
            const user = await getUserById(decoded.nameidentifier);
            const encryptedToken = CryptoJS.AES.encrypt(tokenData.token, my_secret_key).toString();

            return { accessToken: tokenData.token, user,encryptedToken };
        } catch (error) {
            console.error('Refresh token failed:', error);
            if (error.response?.status === 401) dispatch(logout());
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue, dispatch }) => {
        try {
            const tokenData = await fetchToken(email, password);
            console.log('Token data received:', tokenData);
            if (
                tokenData?.token &&
                tokenData?.refreshToken &&
                tokenData?.refreshTokenExpiryTime
            ) {
                const decoded = decodeToken(tokenData.token);
                console.log('Decoded token:', decoded);
                if (decoded) {
                    setCookieWithExpiryFromToken('accessToken', tokenData.token, dispatch);
                    storeTokens(tokenData.refreshToken, tokenData.refreshTokenExpiryTime);
                    const encryptedToken = CryptoJS.AES.encrypt(tokenData.token, my_secret_key).toString();

                    const user = await getUserById(decoded.nameidentifier);

                    console.log('User fetched:', user);

                    return { accessToken: tokenData.token, user, encryptedToken };
                }
                throw new Error('Token decoding failed');
            }
            throw new Error('Invalid token data');
        } catch (error) {
            console.error('Error fetching user:', error);
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: getCookie('accessToken') || null,
        isLoading: false,
        isInitializing: true,
        error: null,
    },
    reducers: {
        updateAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isInitializing = false;
            localStorage.clear();
            deleteCookie('refreshToken');
            deleteCookie('accessToken');
        },

        updateUserSlice: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            // localStorage.setItem('user', JSON.stringify(state.user));
        },
        setUser(state, action) {
            state.user = action.payload;
            state.isInitializing = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;

            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                console.log('User after login:', action.payload.user);
                localStorage.setItem('encryptedToken', action.payload.encryptedToken);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Login failed';
                console.error('Login failed:', action.error.message);
            })

            .addCase(refreshToken.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                console.log('User after token refresh:', action.payload.user);
                localStorage.setItem('encryptedToken', action.payload.encryptedToken);

            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Token refresh failed';
            });
    },
});

export const { logout, updateAccessToken, updateUserSlice, setUser } = authSlice.actions;
export default authSlice.reducer;