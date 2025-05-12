const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    sender: {
        type: String
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    ReceiverId: {
        type: String
    },
    meetingId: {
        type: String,
    },
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'schedule',
    },
    message: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('chat', chatSchema)