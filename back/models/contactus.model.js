const mongoose = require('mongoose')

const contactSchema = mongoose.Schema({
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phoneno: {
        type: Number,
        require: true
    },
    message: {
        type: String,
        require: true
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('contact', contactSchema)