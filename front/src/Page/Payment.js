import React from 'react'
import NavBar from '../Component/NavBar';
import Footer from '../Component/Footer';

function Payment() {
    return (
        <div>

            <section style={{ backgroundColor: "#060A11" }}>
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
                            <div className="row">
                                <div className="col-lg-6 col-12 B_form_responsive">
                                    <form className="B_billing_details text-white">
                                        <h4 className="mb-4 B_biling_text">Billing Details</h4>

                                        <div className="mb-3">
                                            <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>Name</label>
                                            <input
                                                type="text"
                                                className="form-control B_form_control"
                                                placeholder="Enter name"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>Email</label>
                                            <input
                                                type="email"
                                                className="form-control B_form_control"
                                                placeholder="Enter email"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>Phone No.</label>
                                            <input
                                                type="tel"
                                                className="form-control B_form_control"
                                                placeholder="Enter phone no."
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>Address</label>
                                            <input
                                                type="text"
                                                className="form-control B_form_control"
                                                placeholder="Enter street address"
                                            />
                                        </div>

                                        <div className="row ">
                                            <div className="col-md-6 mb-3 ps-0 B_formStart_padding">
                                                <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>State</label>
                                                <input
                                                    type="text"
                                                    className="form-control B_form_control"
                                                    placeholder="Enter state"
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3 pe-0 B_formStart_padding">
                                                <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>City</label>
                                                <input
                                                    type="text"
                                                    className="form-control B_form_control"
                                                    placeholder="Enter city"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="col-lg-6 col-12 B_form_responsive">
                                    <div className="B_payment_card ">
                                        <div className="mb-3">
                                            <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>Name on card</label>
                                            <input
                                                type="text"
                                                className="form-control B_form_control"
                                                placeholder="Enter name same as on card"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>Card Number</label>
                                            <input
                                                type="text"
                                                className="form-control B_form_control"
                                                placeholder="**** **** **** ****"
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3 ps-0 B_formStart_padding">
                                                <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>Valid Through</label>
                                                <input
                                                    type="text"
                                                    className="form-control B_form_control"
                                                    placeholder="MM / YY"
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3 pe-0 B_formStart_padding">
                                                <label className="mb-2" style={{ fontSize: "13px", color: "#dfe2e4" }}>CVV</label>
                                                <input
                                                    type="text"
                                                    className="form-control B_form_control"
                                                    placeholder="***"
                                                />
                                            </div>
                                        </div>

                                        <div className="text-center">
                                        
                                            <button type="button" class="btn btn-light B_pay">Pay $94.50</button>

                                            <div className="OR-login text-white">
                                                <div className="j_border_center_left"></div>
                                                <span>OR</span>
                                                <div className="j_border_center_right"></div>
                                            </div>
                        
                                            <button type="button" class="btn btn-outline-light B_pay_withPay"> Pay with PayPal</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* Payment Section End.............. */}
                    {/* Footer Section Start.............. */}
                    <Footer />
                    {/* Footer Section End.............. */}
                </div>
            </section>
        </div>
    )
}

export default Payment;
