const user = require('../models/user.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

exports.createNewUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        let chekUser = await user.findOne({ email: req.body.email });

        if (chekUser) {
            return res.json({ status: 400, message: "User Already Exists" });
        }

        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(req.body.password, salt);

        chekUser = await user.create({
            name,
            email,
            password: hashPassword
        });

        return res.json({ status: 200, message: "User Created Successfully", user: chekUser });

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

        if (page && pageSize) {
            startIndex = (page - 1) * pageSize;
            lastIndex = (startIndex + pageSize);
            paginatedUser = paginatedUser.slice(startIndex, lastIndex)
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
        let id = req.params.id
        let userUpdateById = await user.findById(id);

        if (!userUpdateById) {
            return res.json({ status: 400, message: "User Not Found" })
        }

        userUpdateById = await user.findByIdAndUpdate(id, { ...userData }, { new: true });

        return res.json({ status: 200, message: "User Updated SuccessFully", user: userUpdateById });
    }
    catch (error) {
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
