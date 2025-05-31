const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    rayzorpaymentId: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    cardName: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    validThrough: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD' // Default currency
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Payment', PaymentSchema);