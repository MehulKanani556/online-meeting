const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    trouble: [{
        audio: {
            type: String,
        },
        video: {
            type: String,
        },
        connection: {
            type: String,
        },
    }],
    comments: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('review', reviewSchema)