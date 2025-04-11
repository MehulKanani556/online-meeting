import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Utils/baseUrl";
import { setAlert } from "./alert.slice";

const initialStateReviews = {
    allreview: [],
    currreview: null,
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllreview = createAsyncThunk(
    "reviews/getAll",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/allreviews`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.reviews;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const createreview = createAsyncThunk(
    'reviews/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.post(BASE_URL + '/createreviews', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllreview());
            return response.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deletereview = createAsyncThunk(
    'reviews/delete',
    async (id, { dispatch, rejectWithValue }) => {
        console.log(id);
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.delete(`${BASE_URL}/deletereviews/${id}`, {
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

export const updatereview = createAsyncThunk(
    'reviews/update',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.put(BASE_URL + '/reviewsUpdate', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllreview());
            return response.data.reviews;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);


export const getreviewById = createAsyncThunk(
    'reviews/reviewsById',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/getreviewsById/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllreview());
            return response.data.reviews;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState: initialStateReviews,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllreview.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching review...';
            })
            .addCase(getAllreview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'review fetched successfully';
                state.allreview = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllreview.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch review';
            })
            .addCase(createreview.pending, (state) => {
                state.loading = true;
                state.message = 'Adding review...';
            })
            .addCase(createreview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allreview.push(action.payload);
                state.message = action.payload?.message || 'review added successfully';
            })
            .addCase(createreview.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add review';
            })
            .addCase(deletereview.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting review...';
            })
            .addCase(deletereview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allreview = state.allreview.filter((con) => con._id !== action.payload);
                state.message = action.payload?.message || 'review deleted successfully';
            })
            .addCase(deletereview.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete review';
            })
            .addCase(updatereview.pending, (state) => {
                state.loading = true;
                state.message = 'Editing review...';
            })
            .addCase(updatereview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allreview = state.allreview.map(review =>
                    review._id === action.payload._id ? action.payload : review
                );
                state.message = action.payload?.message || 'review updated successfully';
            })
            .addCase(updatereview.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update review';
            })
            .addCase(getreviewById.pending, (state) => {
                state.loading = true;
                state.message = 'Getting review...';
            })
            .addCase(getreviewById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currreview = action.payload;
            })
            .addCase(getreviewById.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to get review';
            })
    }
});

export default reviewSlice.reducer;