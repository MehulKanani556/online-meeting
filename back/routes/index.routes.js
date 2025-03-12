const express = require('express');
const indexRoutes = express.Router()
const upload = require("../helper/uplodes");
const { removeUser, updateUser, getUserById, getAllUsers, createNewUser, removeUserProfilePic, resetPassword } = require('../controller/user.controller');
const { userLogin, googleLogin, forgotPassword, verifyOtp, changePassword, userLogout } = require('../auth/auth');
const { getAllcontact, getcontactById, updatecontact, removecontact, createNewcontact } = require('../controller/contactus.controller');
const { createNewreviews, getAllreviews, getreviewsById, updatereviews, removereviews } = require('../controller/review.controller');
const { createNewschedule, getAllschedule, getscheduleById, updateschedule, removeschedule } = require('../controller/schedule.controller');

// auth Routes

indexRoutes.post("/userLogin", userLogin);
indexRoutes.post('/logout/:id', userLogout);
indexRoutes.post("/google-login", googleLogin);
indexRoutes.post('/forgotPassword', forgotPassword)
indexRoutes.post('/verifyOtp', verifyOtp)
indexRoutes.post('/changePassword', changePassword)

// user Routes 

indexRoutes.post('/createUser', createNewUser);
indexRoutes.get('/allUsers', getAllUsers);
indexRoutes.get('/getUserById/:id', getUserById);
indexRoutes.put('/userUpdate/:id', upload.single("photo"), updateUser);
indexRoutes.delete('/deleteUser/:id', removeUser);
indexRoutes.put('/removeProfilePic/:id', removeUserProfilePic);
indexRoutes.put('/resetPassword', resetPassword);

// contact Routes 

indexRoutes.post('/createcontact', createNewcontact);
indexRoutes.get('/allcontact', getAllcontact);
indexRoutes.get('/getcontactById/:id', getcontactById);
indexRoutes.put('/contactUpdate/:id', updatecontact);
indexRoutes.delete('/deletecontact/:id', removecontact);

// reviews Routes 

indexRoutes.post('/createreviews', createNewreviews);
indexRoutes.get('/allreviews', getAllreviews);
indexRoutes.get('/getreviewsById/:id', getreviewsById);
indexRoutes.put('/reviewsUpdate/:id', updatereviews);
indexRoutes.delete('/deletereviews/:id', removereviews);

// schedule Routes 

indexRoutes.post('/createschedule', createNewschedule);
indexRoutes.get('/allschedules', getAllschedule);
indexRoutes.get('/getscheduleById/:id', getscheduleById);
indexRoutes.put('/scheduleUpdate/:id', updateschedule);
indexRoutes.delete('/deleteschedule/:id', removeschedule);

module.exports = indexRoutes