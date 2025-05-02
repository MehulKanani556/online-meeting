import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Utils/baseUrl";
import { setAlert } from "./alert.slice";

const initialStatepersonalroom = {
    allpersonalroom: [],
    currpersonalroom: null,
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllpersonalroom = createAsyncThunk(
    "personalroom/getAll",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/allpersonalroom`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.personalroom;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const createpersonalroom = createAsyncThunk(
    'personalroom/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.post(BASE_URL + '/createpersonalroom', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllpersonalroom());
            return response.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deletepersonalroom = createAsyncThunk(
    'personalroom/delete',
    async (id, { dispatch, rejectWithValue }) => {
        console.log(id);
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.delete(`${BASE_URL}/deletepersonalroom/${id}`, {
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

export const updatepersonalroom = createAsyncThunk(
    'personalroom/update',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.put(BASE_URL + '/personalroomUpdate', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllpersonalroom());
            return response.data.personalroom;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const getpersonalroomById = createAsyncThunk(
    'contants/getpersonalroomById',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/getpersonalroomById/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllpersonalroom());
            return response.data.personalroom;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const personalroomSlice = createSlice({
    name: 'personalrooms',
    initialState: initialStatepersonalroom,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllpersonalroom.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching personal room...';
            })
            .addCase(getAllpersonalroom.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'personal room fetched successfully';
                state.allpersonalroom = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllpersonalroom.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch personal room';
            })
            .addCase(createpersonalroom.pending, (state) => {
                state.loading = true;
                state.message = 'Adding personalroom...';
            })
            .addCase(createpersonalroom.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allpersonalroom.push(action.payload);
                state.message = action.payload?.message || 'personalroom added successfully';
            })
            .addCase(createpersonalroom.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add personalroom';
            })
            .addCase(deletepersonalroom.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting personalroom...';
            })
            .addCase(deletepersonalroom.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allpersonalroom = state.allpersonalroom.filter((con) => con._id !== action.payload);
                state.message = action.payload?.message || 'personalroom deleted successfully';
            })
            .addCase(deletepersonalroom.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete personalroom';
            })
        // .addCase(updatepersonalroom.pending, (state) => {
        //     state.loading = true;
        //     state.message = 'Editing personalroom...';
        // })
        // .addCase(updatepersonalroom.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.success = true;
        //     state.allpersonalroom = state.allpersonalroom.map(personalroom =>
        //         personalroom._id === action.payload._id ? action.payload : personalroom
        //     );
        //     state.message = action.payload?.message || 'personalroom updated successfully';
        // })
        // .addCase(updatepersonalroom.rejected, (state, action) => {
        //     state.loading = false;
        //     state.success = false;
        //     state.message = action.payload?.message || 'Failed to update personalroom';
        // })
        // .addCase(getpersonalroomById.pending, (state) => {
        //     state.loading = true;
        //     state.message = 'Getting personalroom...';
        // })
        // .addCase(getpersonalroomById.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.success = true;
        //     state.currpersonalroom = action.payload;
        // })
        // .addCase(getpersonalroomById.rejected, (state, action) => {
        //     state.loading = false;
        //     state.success = false;
        //     state.message = action.payload?.message || 'Failed to get personalroom';
        // })
    }
});

export default personalroomSlice.reducer;