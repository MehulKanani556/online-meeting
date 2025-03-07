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
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('user', userSchema)