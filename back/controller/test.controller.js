const test = require('../models/test.model');


exports.createNewTest = async (req, res) => {
    try {

        let { email, password } = req.body;

        let chekUser = await test.findOne({ email: req.body.email });

        if (chekUser) {
            return res.json({ status: 400, message: "User Already Exists" });
        }

        let newTest = await test.create({
            email,
            password
        });

        return res.json({ status: 200, message: "Test Created Successfully...", test: newTest });

    } catch (error) {

    }
}
