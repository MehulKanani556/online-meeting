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
        default: 'English'
    },
    timeZone: {
        type: String,
        default: 'Asia/Kolkata'
    },
    originalaudio: {
        type: Boolean,
        default: true
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
        default: true
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
        default: true
    },
    sharescreen: {
        type: Boolean,
        default: true
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
    },
    Pricing: {
        type: String,
    },
    planType: {
        type: String,
        enum: ['Basic', 'Professional', 'Business'], // Add your plan types here
        default: 'Basic'
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('user', userSchema)