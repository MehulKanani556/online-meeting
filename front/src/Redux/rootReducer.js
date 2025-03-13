import { combineReducers } from "redux";
import alertSlice from "./Slice/alert.slice";
import userSlice from "./Slice/user.slice";
import authSlice from "./Slice/auth.slice";
import contactsSlice from "./Slice/contactus.slice";
import reviewSlice from "./Slice/reviews.slice";
import scheduleSlice from "./Slice/schedule.slice";

export const rootReducer = combineReducers({
    alert: alertSlice,
    user: userSlice,
    auth: authSlice,
    contact: contactsSlice,
    review: reviewSlice,
    schedule: scheduleSlice,
});