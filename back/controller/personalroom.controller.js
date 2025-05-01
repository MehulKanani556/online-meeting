const personalroom = require('../models/personalroom.models');

exports.createNewpersonalroom = async (req, res) => {
    try {
        let { userId, name, MeetingID, InviteLink, Security, Password } = req.body;

        let existingRoom = await personalroom.findOne({ MeetingID });

        if (existingRoom) {
            return res.json({ status: 400, message: "A personal room already exists." });
        }

        let chekpersonalroom = await personalroom.create({
            userId,
            name,
            MeetingID,
            InviteLink,
            Security,
            Password
        });

        return res.json({ status: 200, message: "Personal Room create successfully...", personalroom: chekpersonalroom });

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getAllpersonalroom = async (req, res) => {
    try {
        let paginatedpersonalroom;

        // paginatedpersonalroom = await personalroom.find()
        paginatedpersonalroom = await personalroom.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            }
        ]);

        let count = paginatedpersonalroom.length;

        if (count === 0) {
            return res.json({ status: 400, message: "Personal Room Not Found" })
        }

        return res.json({ status: 200, totalpersonalrooms: count, message: "All Personal Room Found SuccessFully", personalroom: paginatedpersonalroom })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.getpersonalroomById = async (req, res) => {
    try {
        let id = req.params.id

        let personalroomFindById = await personalroom.findById(id);

        if (!personalroomFindById) {
            return res.json({ status: 400, message: "Personal Room Not Found" })
        }

        return res.json({ status: 200, message: "Personal Room Found SuccessFully", personalroom: personalroomFindById })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

exports.updatepersonalroom = async (req, res) => {
    try {
        let id = req.params.id
        let personalroomData = req.body;
        let personalroomUpdateById = await personalroom.findById(id);

        if (!personalroomUpdateById) {
            return res.json({ status: 400, message: "Personal Room Not Found" })
        }

        personalroomUpdateById = await personalroom.findByIdAndUpdate(id, { ...personalroomData }, { new: true });

        return res.json({ status: 200, message: "Personal Room Updated SuccessFully", personalroom: personalroomUpdateById });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: error.message });
    }
};

exports.removepersonalroom = async (req, res) => {
    try {
        let id = req.params.id

        let removepersonalroom = await personalroom.findById(id);

        if (!removepersonalroom) {
            return res.json({ status: 400, message: "Personal Room Not Found" })
        }

        await personalroom.findByIdAndDelete(id);

        return res.json({ status: 200, message: "Personal Room Deleted SuccessFully" })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}