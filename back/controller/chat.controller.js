const chat = require('../models/chat.model');

exports.createchat = async (messagedata) => {
    try {
        let { senderId, sender, ReceiverId, meetingId, scheduleId, message } = messagedata;

        console.log("messagedata", messagedata);

        let checkchats = await chat.create({
            senderId,
            sender,
            ReceiverId,
            meetingId,
            scheduleId,
            message
        });

        return checkchats;

    } catch (error) {
        console.log(error);
    }
};

exports.getchatsById = async (req, res) => {
    try {
        let meetingId = req.params.id;

        let Allchats = await chat.aggregate([
            {
                $match: { meetingId: meetingId }
            }
        ]);

        if (!Allchats || Allchats.length === 0) {
            return res.json({ status: 400, message: "Chats Not Found" });
        }

        return res.json({ status: 200, message: "Chats Found Successfully...", chats: Allchats });

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};

