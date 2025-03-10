const user = require('../models/user.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

exports.createNewUser = async (req, res) => {
    try {
        let { name, email, password, timeZone, language, photo } = req.body;

        let chekUser = await user.findOne({ email: req.body.email });

        if (chekUser) {
            return res.json({ status: 400, message: "User Already Exists" });
        }

        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(req.body.password, salt);

        chekUser = await user.create({
            name,
            email,
            password: hashPassword,
            timeZone,
            language
        });

        let token = await jwt.sign(
            { _id: chekUser._id },
            process.env.SECRET_KEY,
            { expiresIn: "1D" }
        );

        return res.json({ status: 200, message: "User Register Successfully...", user: chekUser, token: token });

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        let paginatedUser;

        paginatedUser = await user.find()

        let count = paginatedUser.length;

        if (count === 0) {
            return res.json({ status: 400, message: "Users Not Found" })
        }

        return res.json({ status: 200, totalUsers: count, message: "All User Found SuccessFully", user: paginatedUser })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getUserById = async (req, res) => {
    try {
        let id = req.params.id

        let userFindById = await user.findById(id);

        if (!userFindById) {
            return res.json({ status: 400, message: "User Not Found" })
        }

        return res.json({ status: 200, message: "User Found SuccessFully", user: userFindById })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.updateUser = async (req, res) => {
    try {
        let id = req.params.id;
        let userData = req.body;
        const filePath = req.file ? req.file.path : null;
        console.log("filePath", filePath);
        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file);

        let userUpdateById = await user.findById(id);

        if (!userUpdateById) {
            return res.json({ status: 400, message: "User Not Found" });
        }

        const updateData = { ...userData };
        if (filePath) {
            updateData.photo = filePath;
        } else if (updateData.photo === "null") {
            updateData.photo = null;
        }
        console.log("updateData", updateData);

        userUpdateById = await user.findByIdAndUpdate(id, updateData, { new: true });

        return res.json({ status: 200, message: "User Updated Successfully", user: userUpdateById });
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: error.message });
    }
};

exports.removeUser = async (req, res) => {
    try {
        let id = req.params.id

        let removeUser = await user.findById(id);

        if (!removeUser) {
            return res.json({ status: 400, message: "User Not Found" })
        }

        await user.findByIdAndDelete(id);

        return res.json({ status: 200, message: "User Deleted SuccessFully" })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.removeUserProfilePic = async (req, res) => {
    try {
        let id = req.params.id;

        let userUpdateById = await user.findById(id);

        if (!userUpdateById) {
            return res.json({ status: 400, message: "User Not Found" });
        }

        // Remove the photo field
        userUpdateById.photo = null;
        await userUpdateById.save();

        return res.json({ status: 200, message: "Profile picture removed successfully" });
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        const users = await user.findOne({ email });
        if (!users) {
            return res.status(400).json({ message: "User Not Found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, users.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        users.password = await bcrypt.hash(newPassword, salt);
        await users.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};
