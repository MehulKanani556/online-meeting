const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    photo: {
        type: String,
    },
    otp: {
        type: Number,
    },
    displayName: {
        type: String,
        require: true
    },
    language: {
        type: String,
    },
    timeZone: {
        type: String,
    },
    originalaudio: {
        type: Boolean,
        default: false
    },
    GoogleCalendar: {
        type: Boolean,
        default: false
    },
    Chatnotification: {
        type: Boolean,
        default: true
    },
    Joinnotification: {
        type: Boolean,
        default: false
    },
    joinwithouthost: {
        type: Boolean,
        default: false
    },
    participantsNameandVideo: {
        type: Boolean,
        default: true
    },
    videomuted: {
        type: Boolean,
        default: false
    },
    sharescreen: {
        type: Boolean,
        default: false
    },
    Autorecord: {
        type: Boolean,
        default: false
    },
    Recordinglayout: {
        type: String,
        enum: ['0', 'videowithscharescreen', 'activespeakerscreenshare']
    },
    googleAccessToken: {
        type: String,
    },
    googleRefreshToken: {
        type: String,
    },
    googleTokenExpiry: {
        type: Date,
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('user', userSchema)