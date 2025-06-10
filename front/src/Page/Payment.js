import React, { useEffect, useState } from 'react'
import NavBar from '../Component/NavBar';
import Footer from '../Component/Footer';
import { useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { createpayment } from '../Redux/Slice/payment.slice';
import PayPalButton from './PayPalButton';

function Payment() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { price, Pricing, planType } = location.state || { price: '0.00' };
    const userId = sessionStorage.getItem('userId')

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const PaymentSchema = Yup.object().shape({
        name: Yup.string()
            .matches(/^[A-Za-z\s]+$/, 'Name must only contain letters')
            .required('Name is required'),
        email: Yup.string()
            .email('Invalid email format')
            .matches(/^[^\d]+@[^\d]+\.[^\d]+$/, 'Email should not contain numbers before @')
            .required('Email is required'),
        phone: Yup.string()
            .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
            .required('Phone number is required'),
        address: Yup.string().required('Address is required'),
        state: Yup.string().matches(/^[A-Za-z\s]+$/, 'state must only contain letters').required('State is required'),
        city: Yup.string().matches(/^[A-Za-z\s]+$/, 'City must only contain letters').required('City is required'),
        cardName: Yup.string().matches(/^[A-Za-z\s]+$/, 'Name on card must only contain letters').required('Name on card is required'),
        cardNumber: Yup.string()
            .required('Card number is required')
            .test('card-length', 'Card number must be 16 digits', (value) => {
                const cleanValue = value?.replace(/\s+/g, '') || '';
                return cleanValue.length === 16;
            }),
        // validThrough: Yup.string().required('Valid through date is required').matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Valid through must be in MM/YY format'),
        validThrough: Yup.string()
            .required('Valid through date is required')
            .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Valid through must be in MM/YY format')
            .test('month-validation', 'Month must be between 01 and 12', (value) => {
                if (!value) return false;
                const month = parseInt(value.substring(0, 2));
                return month >= 1 && month <= 12;
            })
            .test('year-validation', 'Year must be current year or future', (value) => {
                if (!value || value.length < 5) return false;
                const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of current year
                const inputYear = parseInt(value.substring(3, 5));
                return inputYear >= currentYear;
            }),
        cvv: Yup.string().required('CVV is required').matches(/^\d{3}$/, 'CVV must be 3 digits'),
    });

    // razorpay key
    const razorpay_key = 'rzp_test_hcOAZE21OIvoXv'
    const razorpay_secret = 'RJwrqMD5YDcBMszCZ6zUmwzI'

    const handlePayment = async (values) => {

        const cleanCardNumber = values.cardNumber.replace(/\s+/g, '');
        const paymentValues = { ...values, cardNumber: cleanCardNumber };

        // Handle Razorpay integration here
        const options = {
            key: razorpay_key,
            amount: price * 100,
            currency: "USD",
            name: "Online Meeting App",
            description: "Online Meeting Payment",
            prefill: {
                name: values.name,
                email: values.email,
                contact: values.phone,
            },
            handler: async (response) => {
                await dispatch(createpayment({ amount: price, ...paymentValues, rayzorpaymentId: response.razorpay_payment_id }));
            },
            theme: {
                color: "#000", // change the color razorpay theme
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Function to format card number with spaces
    const formatCardNumber = (value) => {
        // Remove all spaces and non-digit characters
        const cleanValue = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

        // Add space after every 4 digits
        const formattedValue = cleanValue.match(/.{1,4}/g)?.join(' ') || cleanValue;

        // Limit to 19 characters (16 digits + 3 spaces)
        return formattedValue.substring(0, 19);
    };

    // Function to handle card number change
    const handleCardNumberChange = (event, setFieldValue) => {
        const formattedValue = formatCardNumber(event.target.value);
        setFieldValue('cardNumber', formattedValue);
    };


    const formatValidThrough = (value) => {
        // Remove all non-digit characters
        const cleanValue = value.replace(/[^0-9]/g, '');

        // Limit to 4 digits maximum
        const limitedValue = cleanValue.substring(0, 4);

        // Add slash after 2 digits
        if (limitedValue.length >= 2) {
            return limitedValue.substring(0, 2) + '/' + limitedValue.substring(2);
        }

        return limitedValue;
    };

    // Function to handle valid through change
    const handleValidThroughChange = (event, setFieldValue) => {
        const formattedValue = formatValidThrough(event.target.value);
        setFieldValue('validThrough', formattedValue);
    };

    const handleCVVChange = (event, setFieldValue) => {
        const value = event.target.value;
        // Remove all non-digit characters and limit to 3 digits
        const cleanValue = value.replace(/[^0-9]/g, '').substring(0, 3);
        setFieldValue('cvv', cleanValue);
    };

    return (
        <div>

            <section style={{ backgroundColor: "#060A11", minHeight: '100vh' }}>
                <div className='B_container_new' >
                    {/* NavBar Section Start.............. */}
                    <NavBar />
                    {/* NavBar Section End.............. */}

                    {/* Payment Section Start.............. */}
                    <section className='B_payment_section'>
                        <div className=' text-white text-center '>
                            <h3 className='B_payment_head_text'>Payment</h3>
                        </div>
                        <div>
                            <Formik
                                initialValues={{
                                    userId: userId,
                                    Pricing: Pricing,
                                    planType: planType,
                                    name: '',
                                    email: '',
                                    phone: '',
                                    address: '',
                                    state: '',
                                    city: '',
                                    cardName: '',
                                    cardNumber: '',
                                    validThrough: '',
                                    cvv: '',
                                }}
                                validationSchema={PaymentSchema}
                                onSubmit={async (values, { resetForm }) => {
                                    await handlePayment(values);
                                    resetForm();
                                }}
                            >
                                {({ values, handleChange, handleSubmit, errors, touched, setFieldValue }) => (
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-lg-6 col-12 B_form_responsive">
                                                <div className="B_billing_details text-white">
                                                    <h4 className="mb-4 B_biling_text">Billing Details</h4>

                                                    <div className="mb-3">
                                                        <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>Name</label>
                                                        <input
                                                            type="text"
                                                            id='name'
                                                            className="form-control B_form_control"
                                                            placeholder="Enter name"
                                                            onChange={handleChange}
                                                            value={values.name}
                                                        />
                                                        {errors.name && touched.name && (
                                                            <div style={{ color: '#cd1425', fontSize: '13px', marginTop: '5px' }}>{errors.name}</div>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>Email</label>
                                                        <input
                                                            type="email"
                                                            id='email'
                                                            className="form-control B_form_control"
                                                            placeholder="Enter email"
                                                            onChange={handleChange}
                                                            value={values.email}
                                                        />
                                                        {errors.email && touched.email && (
                                                            <div style={{ color: '#cd1425', fontSize: '13px', marginTop: '5px' }}>{errors.email}</div>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>Phone No.</label>
                                                        {/* <input
                                                            type="tel"
                                                            id='phone'
                                                            className="form-control B_form_control"
                                                            placeholder="Enter phone no."
                                                            onChange={handleChange}
                                                            value={values.phone}
                                                        /> */}
                                                        <input
                                                            type="tel"
                                                            id="phone"
                                                            className="form-control B_form_control"
                                                            placeholder="Enter phone no."
                                                            onChange={handleChange}
                                                            value={values.phone}
                                                            onKeyPress={(e) => {
                                                                if (!/[0-9]/.test(e.key)) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        />
                                                        {errors.phone && touched.phone && (
                                                            <div style={{ color: '#cd1425', fontSize: '13px', marginTop: '5px' }}>{errors.phone}</div>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>Address</label>
                                                        <input
                                                            type="text"
                                                            id='address'
                                                            className="form-control B_form_control"
                                                            placeholder="Enter street address"
                                                            onChange={handleChange}
                                                            value={values.address}
                                                        />
                                                        {errors.address && touched.address && (
                                                            <div style={{ color: '#cd1425', fontSize: '13px', marginTop: '5px' }}>{errors.address}</div>
                                                        )}
                                                    </div>

                                                    <div className="row ">
                                                        <div className="col-md-6 mb-3 ps-0 B_formStart_padding">
                                                            <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>State</label>
                                                            <input
                                                                type="text"
                                                                id='state'
                                                                className="form-control B_form_control"
                                                                placeholder="Enter state"
                                                                onChange={handleChange}
                                                                value={values.state}
                                                            />
                                                            {errors.state && touched.state && (
                                                                <div style={{ color: '#cd1425', fontSize: '13px', marginTop: '5px' }}>{errors.state}</div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-6 mb-3 pe-0 B_formStart_padding">
                                                            <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>City</label>
                                                            <input
                                                                type="text"
                                                                id='city'
                                                                className="form-control B_form_control"
                                                                placeholder="Enter city"
                                                                onChange={handleChange}
                                                                value={values.city}
                                                            />
                                                            {errors.city && touched.city && (
                                                                <div style={{ color: '#cd1425', fontSize: '13px', marginTop: '5px' }}>{errors.city}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-12 B_form_responsive">
                                                <div className="B_payment_card ">
                                                    <div className="mb-3">
                                                        <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>Name on card</label>
                                                        <input
                                                            type="text"
                                                            id='cardName'
                                                            className="form-control B_form_control"
                                                            placeholder="Enter name same as on card"
                                                            onChange={handleChange}
                                                            value={values.cardName}
                                                        />
                                                        {errors.cardName && touched.cardName && (
                                                            <div style={{ color: '#cd1425', fontSize: '13px', marginTop: '5px' }}>{errors.cardName}</div>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>Card Number</label>
                                                        <input
                                                            type="text"
                                                            id='cardNumber'
                                                            className="form-control B_form_control"
                                                            placeholder="**** **** **** ****"
                                                            onChange={(e) => handleCardNumberChange(e, setFieldValue)}
                                                            value={values.cardNumber}
                                                        />
                                                        {errors.cardNumber && touched.cardNumber && (
                                                            <div style={{ color: '#cd1425', fontSize: '13px', marginTop: '5px' }}>{errors.cardNumber}</div>
                                                        )}
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6 mb-3 ps-0 B_formStart_padding">
                                                            <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>Valid Through</label>
                                                            <input
                                                                type="text"
                                                                className="form-control B_form_control"
                                                                id='validThrough'
                                                                placeholder="MM/YY"
                                                                onChange={(e) => handleValidThroughChange(e, setFieldValue)}
                                                                value={values.validThrough}
                                                                maxLength="5"
                                                                onKeyPress={(e) => {
                                                                    // Only allow numbers
                                                                    if (!/[0-9]/.test(e.key)) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                            />
                                                            {errors.validThrough && touched.validThrough && (
                                                                <div style={{ color: '#cd1425', fontSize: '13px', marginTop: '5px' }}>{errors.validThrough}</div>
                                                            )}
                                                        </div>
                                                        {/* <div className="col-md-6 mb-3 pe-0 B_formStart_padding">
                                                            <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>CVV</label>
                                                            <input
                                                                type="text"
                                                                id='cvv'
                                                                className="form-control B_form_control"
                                                                placeholder="***"
                                                                onChange={handleChange}
                                                                value={values.cvv}
                                                            />
                                                            {errors.cvv && touched.cvv && (
                                                                <div style={{ color: '#cd1425', fontSize: '13px', marginTop: '5px' }}>{errors.cvv}</div>
                                                            )}
                                                        </div> */}
                                                        <div className="col-md-6 mb-3 pe-0 B_formStart_padding">
                                                            <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>CVV</label>
                                                            <input
                                                                type="password"
                                                                id='cvv'
                                                                className="form-control B_form_control"
                                                                placeholder="***"
                                                                onChange={(e) => handleCVVChange(e, setFieldValue)}
                                                                value={values.cvv} // Display masked value
                                                                maxLength="3"
                                                                onKeyPress={(e) => {
                                                                    // Only allow numbers
                                                                    if (!/[0-9]/.test(e.key)) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                onPaste={(e) => {
                                                                    // Handle paste events to only allow numbers
                                                                    e.preventDefault();
                                                                    const paste = e.clipboardData.getData('text');
                                                                    const numericPaste = paste.replace(/[^0-9]/g, '').substring(0, 3);
                                                                    setFieldValue('cvv', numericPaste);
                                                                }}
                                                            />
                                                            {errors.cvv && touched.cvv && (
                                                                <div style={{ color: '#cd1425', fontSize: '13px', marginTop: '5px' }}>{errors.cvv}</div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="text-center">

                                                        <button type="submit" className="btn btn-light B_pay_withPay" style={{ cursor: 'pointer' }}>Pay ${price}</button>

                                                        <div className="OR-login text-white">
                                                            <div className="j_border_center_left"></div>
                                                            <span>OR</span>
                                                            <div className="j_border_center_right"></div>
                                                        </div>

                                                        {/* <button type="button" class="btn btn-outline-light B_pay"> Pay with PayPal</button> */}
                                                        <PayPalButton amount={price} />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </section>


                    {/* Payment Section End.............. */}
                    {/* Footer Section Start.............. */}
                    <Footer />
                    {/* Footer Section End.............. */}
                </div>
            </section >
        </div >
    )
}

export default Payment;
