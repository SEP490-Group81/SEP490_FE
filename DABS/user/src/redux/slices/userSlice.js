import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteCookie, storeTokens, getCookie } from '../../utils/cookieSettings';
import { fetchToken, refreshToken as refreshTokenService } from '../../services/auth';
import { decodeToken, setCookieWithExpiryFromToken } from '../../utils/jwtUtils';
import { getUserById } from '../../services/user';

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const refreshToken = getCookie('refreshToken');
            if (!refreshToken) {
                dispatch(logout());
                throw new Error('No refresh token found');
            }

            const tokenData = await refreshTokenService(refreshToken);

            if (!tokenData?.token || !tokenData?.refreshToken || !tokenData?.refreshTokenExpiryTime) {
                throw new Error('Invalid token data');
            }

            const decoded = decodeToken(tokenData.token);
            if (!decoded) throw new Error('Token decoding failed');

            const user = await getUserById(decoded.nameidentifier);

            setCookieWithExpiryFromToken('token', tokenData.token);
            storeTokens(tokenData.refreshToken, tokenData.refreshTokenExpiryTime);

            return { user };
        } catch (error) {
            console.error('Refresh token failed:', error);
            if (error.response?.status === 401) dispatch(logout());
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
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
                    const user = await getUserById(decoded.nameidentifier);
                    console.log('User fetched:', user);
                    setCookieWithExpiryFromToken('accessToken', tokenData.token);
                    return { user };
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
        user: JSON.parse(localStorage.getItem('user')) || null,
        isLoading: false,
        isInitializing: true,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isInitializing = false;
            localStorage.clear();
            deleteCookie('token');
            deleteCookie('refreshToken');
            deleteCookie('refreshTokenExpiryTime');
        },
        restoreSession: (state, action) => {
            state.user = action.payload.user;
            state.isInitializing = false;
        },
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
                console.log('User after login:', action.payload.user);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
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
                console.log('User after token refresh:', action.payload.user);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Token refresh failed';
            });
    },
});

export const { logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;