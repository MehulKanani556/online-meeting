import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import NavBar from '../Component/NavBar';
import Footer from '../Component/Footer';
import check_icon from '../Image/True.svg';

function Pricing() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [Pricing, setPricing] = useState('monthly');

    return (
        <div>
            <section style={{ backgroundColor: "#060A11", minHeight: '100vh' }}>
                <div className='B_container_new' >
                    {/* NavBar Section Start.............. */}
                    <NavBar />
                    {/* NavBar Section End.............. */}

                    {/* Simple & Affordable Pricing Plans Section Start.............. */}

                    <section className='B_simple_affordable'>
                        <div className='text-center text-white'>
                            <h2 className='B_simple_affo_head_text'>Simple & Affordable Pricing Plans</h2>
                            <p className='B_simple_affo_text' style={{ color: "#87898B" }}>Connect smarter with our flexible pricing - powerful features at the right price!</p>
                        </div>
                    </section>

                    {/* Simple & Affordable Pricing Plans Section End.............. */}

                    {/* Pricing Section Start.............. */}

                    <section className='B_pricing_section'>
                        <div className='d-flex justify-content-center'>
                            <div className='d-flex' style={{ backgroundColor: '#101924', padding: '6px', borderRadius: '8px' }}>
                                <button
                                    type="button"
                                    className="B_pricing_button border-0 rounded"
                                    style={{
                                        minWidth: '100px',
                                        backgroundColor: Pricing === 'monthly' ? '#2A323B' : 'transparent',
                                        color: Pricing === 'monthly' ? '#ffffff' : '#87898B'
                                    }}
                                    onClick={() => setPricing('monthly')}
                                >
                                    Monthly
                                </button>
                                <button
                                    type="button"
                                    className="B_pricing_button border-0 rounded"
                                    style={{
                                        minWidth: '100px',
                                        backgroundColor: Pricing === 'yearly' ? '#2A323B' : 'transparent',
                                        color: Pricing === 'yearly' ? '#ffffff' : '#87898B'
                                    }}
                                    onClick={() => setPricing('yearly')}
                                >
                                    Yearly
                                </button>
                            </div>
                        </div>

                        <div className='B_CARD_Price'>
                            <div className='row g-lg-4 g-xl-5 justify-content-center '>
                                {/* Basic Plan */}
                                <div className='col-md-6 col-lg-4 col-12 B_card_margin '>
                                    <div className='B_Card_padding h-100' style={{ backgroundColor: '#090E16', borderRadius: '5px' }}>
                                        <h5 className='text-white'>Basic</h5>
                                        <h4 className='text-white B_price_text'>
                                            ${Pricing === 'yearly' ? '44.50' : '4.50'}/
                                            <span style={{ fontSize: '16px', color: '#87898B' }}>{Pricing}</span>
                                        </h4>
                                        <p className='B_cardPrice_text' style={{ color: '#b8babb' }}>Best for individuals and small teams.</p>

                                        <Link to="/payment" state={{ price: Pricing === 'yearly' ? '44.50' : '4.50' }}>
                                            <button className='btn B_price_btn btn-light fw-bold w-100 '>Continue To Pay</button>
                                        </Link>

                                        <div>
                                            <div className='OR-login'>
                                                <div className="j_border_center_left"></div>
                                                <span style={{ color: '#87898B' }} >Features </span>
                                                <div className="j_border_center_right"></div>
                                            </div>
                                            <div className='d-flex align-items-center mb-3 B_PRIC_feature'>
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#dadada" }} className='B_Ture_text'>Meetings up to 40 minute</span>
                                            </div>
                                            <div className='d-flex align-items-center mb-3'>
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#dadada" }} className='B_Ture_text'>50 participants per meeting</span>
                                            </div>
                                            <div className='d-flex align-items-center mb-3'>
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#dadada" }} className='B_Ture_text'>Team Chat</span>
                                            </div>
                                            <div className='d-flex align-items-center mb-3'>
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#dadada" }} className='B_Ture_text'>Schedule Meetings in advance</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Plan */}
                                <div className='col-md-6 col-lg-4 col-12 B_card_margin'>
                                    <div className='B_Card_padding h-100' style={{ backgroundColor: '#090E16', borderRadius: '5px' }}>
                                        <h5 className='text-white'>Professional</h5>
                                        <h4 className='text-white B_price_text'>
                                            ${Pricing === 'yearly' ? '94.50' : '9.50'}/
                                            <span style={{ fontSize: '16px', color: '#87898B' }}>{Pricing}</span>
                                        </h4>
                                        <p className='B_cardPrice_text' style={{ color: '#b8babb' }}>Perfect for growing teams.</p>

                                        <Link to="/payment" state={{ price: Pricing === 'yearly' ? '94.50' : '9.50' }}>
                                            <button className='btn B_price_btn btn-light fw-bold w-100 '>Continue To Pay</button>
                                        </Link>

                                        <div>
                                            <div className='OR-login'>
                                                <div className="j_border_center_left"></div>
                                                <span style={{ color: '#87898B' }}>Features</span>
                                                <div className="j_border_center_right"></div>
                                            </div>
                                            <div className='d-flex align-items-center mb-3 B_PRIC_feature'>
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#dadada" }} className='B_Ture_text'>Meetings up to 30 hours</span>
                                            </div>
                                            <div className='d-flex align-items-center mb-3'>
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#dadada" }} className='B_Ture_text'>Team Chat</span>
                                            </div>
                                            <div className='d-flex align-items-center mb-3'>
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#dadada" }} className='B_Ture_text'>150 participants per meeting</span>
                                            </div>
                                            <div className='d-flex align-items-center mb-3'>
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#dadada" }} className='B_Ture_text'>Schedule Meetings in advance</span>
                                            </div>
                                            <div className='d-flex align-items-center mb-3'>
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#dadada" }} className='B_Ture_text'>Record all Meetings</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Business Plan */}
                                <div className='col-md-6 col-lg-4 col-12 B_card_margin'>
                                    <div className='B_Card_padding h-100' style={{ backgroundColor: '#090E16', borderRadius: '5px' }}>
                                        <h5 className='text-white'>Business</h5>
                                        <h4 className='text-white B_price_text'>
                                            ${Pricing === 'yearly' ? '150.50' : '15.50'}/
                                            <span style={{ fontSize: '16px', color: '#87898B' }}>{Pricing}</span>
                                        </h4>
                                        <p className='B_cardPrice_text' style={{ color: '#b8babb' }}>Designed for large teams and organizations.</p>

                                        <Link to="/payment" state={{ price: Pricing === 'yearly' ? '150.50' : '15.50' }}>
                                            <button className='btn B_price_btn btn-light fw-bold w-100 '>Continue To Pay</button>
                                        </Link>

                                        <div>

                                            <div className='OR-login'>
                                                <div className="j_border_center_left"></div>
                                                <span style={{ color: '#87898B' }}>Features</span>
                                                <div className="j_border_center_right"></div>
                                            </div>

                                            <div className='d-flex align-items-center mb-3 B_PRIC_feature' >
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#dadada" }} className='B_Ture_text'>Meetings up to 48 hours</span>
                                            </div>
                                            <div className='d-flex align-items-center mb-3'>
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#dadada" }} className='B_Ture_text'>Team Chat</span>
                                            </div>
                                            <div className='d-flex align-items-center mb-3'>
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#bebebe" }} className='B_Ture_text'>300 participants per meeting</span>
                                            </div>
                                            <div className='d-flex align-items-center mb-3'>
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#dadada" }} className='B_Ture_text'>Schedule Meetings in advance</span>
                                            </div>
                                            <div className='d-flex align-items-center mb-3'>
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#dadada" }} className='B_Ture_text'>Record all Meetings</span>
                                            </div>
                                            <div className='d-flex align-items-center mb-3'>
                                                <img src={check_icon} className='B_true_icon' alt="check_icon" />
                                                <span style={{ color: "#dadada" }} className='B_Ture_text'>Share screen</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pricing Section End.............. */}

                    {/* Footer Section Start.............. */}

                    <Footer />

                    {/* Footer Section End.............. */}
                </div>
            </section>
        </div>
    )
}

export default Pricing;
