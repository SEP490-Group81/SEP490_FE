import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteCookie, storeTokens } from '../../utils/cookieSettings';
import { fetchToken } from '../../services/auth';
import { decodeToken, setCookieWithExpiryFromToken } from '../../utils/jwtUtils';
import { getUserById } from '../../services/user';


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
                    setCookieWithExpiryFromToken('token', tokenData.token);
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
        user: null,
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
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Login failed';
                console.error('Login failed:', action.error.message);
            });
    },
});

export const { logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;