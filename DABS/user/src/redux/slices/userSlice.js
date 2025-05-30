import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from '../../utils/cookieSettings';
import { checkUserCredentials } from '../../services/loginServices';



export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const result = await checkUserCredentials(email, password);

            if (result.success) {
                return result.user;
            } else {
                return rejectWithValue(result.message);
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
            deleteCookie('user');
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
                state.user = action.payload;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', action.payload);
                const time = 0.01;
                setCookie("user", action.payload, time);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Login failed';
            });
    },
});

export const { logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;