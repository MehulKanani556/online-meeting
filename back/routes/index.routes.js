const express = require('express');
const { removeUser, updateUser, getUserById, getAllUsers, createNewUser } = require('../controller/user.controller');
const { userLogin, googleLogin, forgotPassword, verifyOtp, changePassword } = require('../auth/auth');
const indexRoutes = express.Router()


// auth Routes

indexRoutes.post("/userLogin", userLogin);
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

module.exports = indexRoutes