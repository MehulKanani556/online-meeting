import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Utils/baseUrl";
import { setAlert } from "./alert.slice";

const initialStatecontacts = {
    allcontact: [],
    currcontact: null,
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllcontact = createAsyncThunk(
    "contact/getAll",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/allcontact`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.contact;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const createcontact = createAsyncThunk(
    'contact/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.post(BASE_URL + '/createcontact', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllcontact());
            return response.data.contact;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deletecontact = createAsyncThunk(
    'contact/delete',
    async (id, { dispatch, rejectWithValue }) => {
        console.log(id);
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.delete(`${BASE_URL}/deletecontact/${id}`, {
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

export const updatecontact = createAsyncThunk(
    'contact/update',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.put(BASE_URL + '/contactUpdate', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllcontact());
            return response.data.contact;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);


export const getcontactById = createAsyncThunk(
    'contants/getcontactById',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/getcontactById/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAllcontact());
            return response.data.contact;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const contactsSlice = createSlice({
    name: 'contacts',
    initialState: initialStatecontacts,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllcontact.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching contact...';
            })
            .addCase(getAllcontact.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'contact fetched successfully';
                state.allcontact = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllcontact.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch contact';
            })
            .addCase(createcontact.pending, (state) => {
                state.loading = true;
                state.message = 'Adding contact...';
            })
            .addCase(createcontact.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allcontact.push(action.payload);
                state.message = action.payload?.message || 'contact added successfully';
            })
            .addCase(createcontact.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add contact';
            })
            .addCase(deletecontact.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting contact...';
            })
            .addCase(deletecontact.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allcontact = state.allcontact.filter((con) => con._id !== action.payload);
                state.message = action.payload?.message || 'contact deleted successfully';
            })
            .addCase(deletecontact.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete contact';
            })
            .addCase(updatecontact.pending, (state) => {
                state.loading = true;
                state.message = 'Editing contact...';
            })
            .addCase(updatecontact.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allcontact = state.allcontact.map(contact =>
                    contact._id === action.payload._id ? action.payload : contact
                );
                state.message = action.payload?.message || 'contact updated successfully';
            })
            .addCase(updatecontact.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update contact';
            })
            .addCase(getcontactById.pending, (state) => {
                state.loading = true;
                state.message = 'Getting user...';
            })
            .addCase(getcontactById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currcontact = action.payload;
            })
            .addCase(getcontactById.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to get user';
            })
    }
});

export default contactsSlice.reducer;