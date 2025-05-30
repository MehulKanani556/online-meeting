import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Utils/baseUrl";
import { setAlert } from "./alert.slice";

const initialStatepayments = {
    allpayment: [],
    singlePayment: null,
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllpayment = createAsyncThunk(
    "payments/getAll",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/Allpayment`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.paymentDetails;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const createpayment = createAsyncThunk(
    'payments/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.post(BASE_URL + '/createPayment', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllpayment());
            return response.data;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState: initialStatepayments,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllpayment.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching review...';
            })
            .addCase(getAllpayment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'review fetched successfully';
                state.allpayment = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllpayment.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch review';
            })
            .addCase(createpayment.pending, (state) => {
                state.loading = true;
                state.message = 'Adding review...';
            })
            .addCase(createpayment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allpayment.push(action.payload);
                state.message = action.payload?.message || 'review added successfully';
            })
            .addCase(createpayment.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add review';
            });
    }
});

export default paymentSlice.reducer;