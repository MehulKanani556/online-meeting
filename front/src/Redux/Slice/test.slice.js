import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Utils/baseUrl";



const initialStateTest = {
    allTest: [],
    currTest: null,
    success: false,
    message: '',
    loading: false,
};


const handleErrors = (error, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};


export const createNewTest = createAsyncThunk(
    'test/createNewTest',
    async (data, { rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.post(`${BASE_URL}/createNewTest`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data.test;


        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);


const testSlice = createSlice({
    name: 'test',
    initialState: initialStateTest,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createNewTest.pending, (state) => {
                state.loading = true;
                state.message = 'Creating new test...';
            })
            .addCase(createNewTest.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Test created successfully';
                state.allTest = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(createNewTest.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to create test';
            })
    }
});


export default testSlice.reducer;







