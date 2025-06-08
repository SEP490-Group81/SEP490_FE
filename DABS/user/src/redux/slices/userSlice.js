import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkUserCredentials } from '../../services/loginServices';
import { deleteCookie, storeTokens } from '../../utils/cookieSettings';
import { fetchToken } from '../../services/auth';



export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const tokenData = await fetchToken(email, password);
            if (tokenData?.token && tokenData?.refreshToken && tokenData?.refreshTokenExpiryTime) {
                return tokenData;
            } else {
                return rejectWithValue('Invalid login response');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        isLoading: false,
        isInitializing: true,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isInitializing = false;
            localStorage.clear();
            deleteCookie('token');
            deleteCookie('refreshToken');
        },
        restoreSession: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
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
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
                state.refreshTokenExpiryTime = action.payload.refreshTokenExpiryTime;
               
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('refreshToken', action.payload.refreshToken);
                localStorage.setItem('refreshTokenExpiryTime', action.payload.refreshTokenExpiryTime);

                storeTokens(
                    action.payload.token,
                    action.payload.refreshToken,
                    action.payload.refreshTokenExpiryTime
                );
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Login failed';
            });
    },
});

export const { logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;