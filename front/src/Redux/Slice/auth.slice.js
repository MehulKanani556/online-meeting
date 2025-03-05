import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sessionStorage from 'redux-persist/es/storage/session';
import axios from 'axios';
import { BASE_URL } from '../../Utils/baseUrl';

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

const initialState = {
    user: null,
    isAuthenticated: !!sessionStorage.getItem('token'),
    loading: false,
    error: null,
    loggedIn: false,
    isLoggedOut: false,
    message: null
};

export const loginuser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/userLogin`, credentials);
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('userId', response.data.user._id);
            return response.data;
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/createUser`, userData);
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('userId', response.data.user._id);
            return response.data;
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);


export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            console.log(email);
            const response = await axios.post(`${BASE_URL}/forgotPassword`, { email });
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/verifyOtp`, { email, otp });
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ email, newPassword }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/changePassword`, { email, newPassword });
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const googleLogin = createAsyncThunk(
    'auth/google-login',
    async ({ uid, name, email, photo }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/google-login`, { uid, name, email, photo });
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('userId', response.data.user._id);
            console.log(response.data);

            return response.data;

        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state, action) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loggedIn = false;
            state.isLoggedOut = true;
            state.message = action.payload?.message || "Logged out successfully";
            window.localStorage.clear();
            window.sessionStorage.clear();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginuser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
                state.message = action.payload?.message || "Login successfully";
                // if (action.payload?.message) {
                //     enqueueSnackbar(action.payload?.message, { variant: 'success' });
                // }
            })
            .addCase(loginuser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.message = action.payload?.message || "Login Failed";
                // enqueueSnackbar(state.message, { variant: 'error' });

            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
                state.message = action.payload?.message || "Register successfully";
                // if (action.payload?.message) {
                //     enqueueSnackbar(action.payload?.message, { variant: 'success' });
                // }
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.message = action.payload?.message || "User Already Exist";
                // enqueueSnackbar(state.message, { variant: 'error' });
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.message = action.payload; // Assuming the API returns a success message
                // enqueueSnackbar(state.message, { variant: 'success' });
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.message = action.payload?.message || "Forgot Password Failed";
                // enqueueSnackbar(state.message, { variant: 'error' });
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.message = action.payload.message; // Assuming the API returns a success message
                // enqueueSnackbar(state.message, { variant: 'success' });
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.message = action.payload.data?.message || "Verify OTP Failed";
                // enqueueSnackbar(state.message, { variant: 'error' });
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.message = action.payload; // Assuming the API returns a success message
                // enqueueSnackbar(state.message, { variant: 'success' });
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.message = action.payload?.message || "Reset Password Failed";
                // enqueueSnackbar(state.message, { variant: 'error' });
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;

                state.message = action.payload?.message || "Google Login successful";
                // if (action.payload?.message) {
                //     enqueueSnackbar(action.payload?.message, { variant: 'success' });
                // }
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.message = action.payload?.message || "Google Login Failed";
                // enqueueSnackbar(state.message, { variant: 'error' });
            })
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;