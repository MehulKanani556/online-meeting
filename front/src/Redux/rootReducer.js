import { combineReducers } from "redux";
import userSlice from "./Slice/user.slice";
import authSlice from "./Slice/auth.slice";
import contactsSlice from "./Slice/contactus.slice";

export const rootReducer = combineReducers({
    user: userSlice,
    auth: authSlice,
    contact: contactsSlice,
});