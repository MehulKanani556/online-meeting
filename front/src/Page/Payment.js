import React, { useEffect } from 'react'
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
    const { price } = location.state || { price: '0.00' };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const PaymentSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string().required('Phone number is required'),
        address: Yup.string().required('Address is required'),
        state: Yup.string().required('State is required'),
        city: Yup.string().required('City is required'),
        cardName: Yup.string().required('Name on card is required'),
        cardNumber: Yup.string().required('Card number is required').matches(/^\d{16}$/, 'Card number must be 16 digits'),
        validThrough: Yup.string().required('Valid through date is required').matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Valid through must be in MM/YY format'),
        cvv: Yup.string().required('CVV is required').matches(/^\d{3}$/, 'CVV must be 3 digits'),
    });

    // razorpay key
    const razorpay_key = 'rzp_test_kw3UIwvQV6qFpp'
    const razorpay_secret = 'DGIBTGQqvJa0qV7Yl4HCvwf5'

    // paypal client id
    const paypal_client_id = 'AS3zPrJ7Y9DtfL2VfSFKs8kJaELe9jInYRsa5N_OvEU2l6-GTDY2CESHZWm2GJo2H7yjZto6kwlAtJkw'

    const handlePayment = async (values) => {
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
                await dispatch(createpayment({ amount: price, ...values, rayzorpaymentId: response.razorpay_payment_id }));
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
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
                                    await handlePayment(values); // Call the payment handler
                                    resetForm();
                                }}
                            >
                                {({ values, handleChange, handleSubmit, errors, touched }) => (
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
                                                        <input
                                                            type="tel"
                                                            id='phone'
                                                            className="form-control B_form_control"
                                                            placeholder="Enter phone no."
                                                            onChange={handleChange}
                                                            value={values.phone}
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
                                                            onChange={handleChange}
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
                                                                placeholder="MM / YY"
                                                                onChange={handleChange}
                                                                value={values.validThrough}
                                                            />
                                                            {errors.validThrough && touched.validThrough && (
                                                                <div style={{ color: '#cd1425', fontSize: '13px', marginTop: '5px' }}>{errors.validThrough}</div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-6 mb-3 pe-0 B_formStart_padding">
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
