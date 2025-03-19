const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
},
    {
        timestamps: true,
        versionKey: false
    });

module.exports = mongoose.model('test', testSchema);

