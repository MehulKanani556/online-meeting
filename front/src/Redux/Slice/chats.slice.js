import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sessionStorage from 'redux-persist/es/storage/session';
import axios from 'axios';
import { BASE_URL } from '../../Utils/baseUrl';
import { setAlert } from './alert.slice';

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

const initialStatechats = {
    currchats: null,
    success: false,
    message: '',
    loading: false,
};

export const getchatsById = createAsyncThunk(
    'chats/getchatsById',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/getchatsById/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            // dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data.chats;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const chatsSlice = createSlice({
    name: 'chats',
    initialState: initialStatechats,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getchatsById.pending, (state) => {
                state.loading = true;
                state.message = 'Getting chats...';
            })
            .addCase(getchatsById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currchats = action.payload;
            })
            .addCase(getchatsById.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to get chats';
            })
    }
});

export default chatsSlice.reducer;