import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Utils/baseUrl";
import Cookies from 'js-cookie';
import { setAlert } from "./alert.slice";

const initialStateUsers = {
    allusers: [],
    currUser: null,
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/allUsers`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.users;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const createUser = createAsyncThunk(
    'users/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post(BASE_URL + '/createUser', data);
            sessionStorage.setItem("token", response.data.token);
            sessionStorage.setItem("userId", response.data.user._id);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllUsers());
            return response.data.user;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/delete',
    async (id, { dispatch, rejectWithValue }) => {
        console.log(id);
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.delete(`${BASE_URL}/deleteUser/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async ({ id, values }, { dispatch, rejectWithValue }) => {
        console.log(id, values);

        const token = await sessionStorage.getItem("token");
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });
        try {
            const response = await axios.put(`${BASE_URL}/userUpdate/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data;
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);


export const getUserById = createAsyncThunk(
    'users/getUserById',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/getUserById/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            // dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllUsers());
            return response.data.user;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState: initialStateUsers,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Users fetched successfully';
                state.allusers = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.message = 'Adding user...';
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allusers.push(action.payload);
                state.message = action.payload?.message || 'User added successfully';
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add user';
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting user...';
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allusers = state.allusers.filter((user) => user._id !== action.payload);
                state.message = action.payload?.message || 'User deleted successfully';
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete user';
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.message = 'Editing user...';
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allusers = state.allusers.map(user =>
                    user._id === action.payload._id ? action.payload : user
                );
                state.message = action.payload?.message || 'User updated successfully';
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update user';
            })
            .addCase(getUserById.pending, (state) => {
                state.loading = true;
                state.message = 'Getting user...';
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currUser = action.payload;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to get user';
            })
    }
});

export default usersSlice.reducer;