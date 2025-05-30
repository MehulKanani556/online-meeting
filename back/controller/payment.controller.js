const Payment = require('../models/payment.modal');
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.razorpay_key,
    key_secret: process.env.razorpay_secret,
});

exports.createPayment = async (req, res) => {
    let { rayzorpaymentId, name, email, phone, address, state, city, cardName, cardNumber, validThrough, cvv, amount } = req.body;

    const options = {
        amount: amount * 100,
        currency: "USD",
        receipt: `receipt_${Date.now()}`,
    };
    try {
        // Create the order with Razorpay
        const order = await razorpay.orders.create(options);

        // Save payment details to the database
        const checkpayment = await Payment.create({
            rayzorpaymentId,
            name,
            email,
            phone,
            address,
            state,
            city,
            cardName,
            cardNumber,
            validThrough,
            cvv,
            amount,
        });

        // res.json(order);

        // return res.json({ status: 200, message: "Payment details saved successfully...", paymentsDetails: checkpayment });

        // Respond with the order and payment details
        return res.json({
            status: 200,
            message: "Payment successfully ...",
            order,
            paymentDetails: checkpayment,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving payment details', error });
    }
};

exports.getAllpayment = async (req, res) => {
    try {
        let allpayment;

        allpayment = await Payment.find()

        let count = allpayment.length;

        if (count === 0) {
            return res.json({ status: 400, message: "Payment Not Found" })
        }

        return res.json({ status: 200, totalpayments: count, message: "All payment Found SuccessFully", paymentDetails: allpayment })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
};