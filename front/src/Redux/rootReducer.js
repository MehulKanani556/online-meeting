import { combineReducers } from "redux";
import alertSlice from "./Slice/alert.slice";
import userSlice from "./Slice/user.slice";
import authSlice from "./Slice/auth.slice";
import contactsSlice from "./Slice/contactus.slice";
import reviewSlice from "./Slice/reviews.slice";
import scheduleSlice from "./Slice/schedule.slice";
import personalroomSlice from "./Slice/personalroom.slice";
import meetingSlice from "./Slice/meeting.slice";

export const rootReducer = combineReducers({
    alert: alertSlice,
    user: userSlice,
    auth: authSlice,
    contact: contactsSlice,
    review: reviewSlice,
    schedule: scheduleSlice,
    personalroom: personalroomSlice,
    meeting: meetingSlice,
});