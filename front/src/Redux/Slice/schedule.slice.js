import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Utils/baseUrl";
import { setAlert } from "./alert.slice";

const initialStateschedule = {
    allschedule: [],
    currschedule: null,
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllschedule = createAsyncThunk(
    "schedules/getAll",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/allschedules`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.schedules;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const createschedule = createAsyncThunk(
    'schedules/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");

            // Transform invitees data to only include emails
            const transformedData = {
                ...data,
                invitees: data.invitees.map(invitee => ({ email: invitee.email, userId: invitee._id })),
            };

            const response = await axios.post(BASE_URL + '/createschedule', transformedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllschedule());
            return response.data.schedules;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteschedule = createAsyncThunk(
    'schedules/delete',
    async (id, { dispatch, rejectWithValue }) => {
        console.log(id);
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.delete(`${BASE_URL}/deleteschedules/${id}`, {
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

export const updateschedule = createAsyncThunk(
    'schedules/update',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.put(BASE_URL + '/schedulesUpdate', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllschedule());
            return response.data.schedules;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const getscheduleById = createAsyncThunk(
    'schedules/schedulesById',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/getschedulesById/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllschedule());
            return response.data.schedules;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const scheduleSlice = createSlice({
    name: 'schedules',
    initialState: initialStateschedule,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllschedule.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching schedule...';
            })
            .addCase(getAllschedule.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'schedule fetched successfully';
                state.allschedule = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllschedule.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch schedule';
            })
            .addCase(createschedule.pending, (state) => {
                state.loading = true;
                state.message = 'Adding schedule...';
            })
            .addCase(createschedule.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allschedule.push(action.payload);
                state.message = action.payload?.message || 'schedule added successfully';
            })
            .addCase(createschedule.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add schedule';
            })
            .addCase(deleteschedule.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting schedule...';
            })
            .addCase(deleteschedule.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allschedule = state.allschedule.filter((con) => con._id !== action.payload);
                state.message = action.payload?.message || 'schedule deleted successfully';
            })
            .addCase(deleteschedule.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete schedule';
            })
            .addCase(updateschedule.pending, (state) => {
                state.loading = true;
                state.message = 'Editing schedule...';
            })
            .addCase(updateschedule.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allschedule = state.allschedule.map(schedule =>
                    schedule._id === action.payload._id ? action.payload : schedule
                );
                state.message = action.payload?.message || 'schedule updated successfully';
            })
            .addCase(updateschedule.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update schedule';
            })
            .addCase(getscheduleById.pending, (state) => {
                state.loading = true;
                state.message = 'Getting schedule...';
            })
            .addCase(getscheduleById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currschedule = action.payload;
            })
            .addCase(getscheduleById.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to get schedule';
            })
    }
});

export default scheduleSlice.reducer;