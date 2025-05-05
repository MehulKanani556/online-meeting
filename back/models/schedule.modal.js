const mongoose = require('mongoose')

const scheduleSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
    },
    date: {
        type: Date,
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    meetingLink: {
        type: String,
    },
    password: {
        type: String,
    },
    description: {
        type: String
    },
    reminder: [{
        type: String,
        enum: ['5 min before', '10 min before', '15 min before', '30 min before', '1 hr before', '2 hr before', '1 day before', '2 days before']
    }],
    recurringMeeting: {
        type: String,
        enum: ['DoesNotRepeat', 'daily', 'weekly', 'monthly', 'custom']
    },
    customRecurrence: {
        repeatType: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly']
        },
        repeatEvery: {
            type: Number,
            min: 1
        },
        Recurrence: {
            type: Number,
            min: 1
        },
        repeatOn: [{
            type: String,
            enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        }],
        Monthfirst: [{
            type: String,
            enum: ['firstmonday', 'firstday']
        }],
        ends: {
            type: String,
            enum: ['never', 'on', 'after']
        },
        endDate: {
            type: Date
        }
    },
    invitees: [{
        email: {
            type: String
        },
        name: {
            type: String
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    }],
    status: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('schedule', scheduleSchema)