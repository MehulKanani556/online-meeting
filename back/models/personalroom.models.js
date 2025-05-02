const mongoose = require('mongoose')

const personalroomSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
    },
    MeetingID: {
        type: String,
    },
    InviteLink: {
        type: String,
    },
    Security: {
        type: String,
    },
    Password: {
        type: String,
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('personalroom', personalroomSchema)