const express = require('express');
const { removeUser, updateUser, getUserById, getAllUsers, createNewUser } = require('../controller/user.controller');
const { userLogin, googleLogin, forgotPassword, verifyOtp, changePassword, userLogout } = require('../auth/auth');
const { getAllcontact, getcontactById, updatecontact, removecontact, createNewcontact } = require('../controller/contactus.controller');
const indexRoutes = express.Router()


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
indexRoutes.put('/userUpdate/:id', updateUser);
indexRoutes.delete('/deleteUser/:id', removeUser);

// contact Routes 

indexRoutes.post('/createcontact', createNewcontact);
indexRoutes.get('/allcontact', getAllcontact);
indexRoutes.get('/getcontactById/:id', getcontactById);
indexRoutes.put('/contactUpdate/:id', updatecontact);
indexRoutes.delete('/deletecontact/:id', removecontact);

module.exports = indexRoutes