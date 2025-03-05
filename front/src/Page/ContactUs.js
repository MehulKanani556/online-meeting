import React from 'react'
import NavBar from '../Component/NavBar';
import location from '../Image/Location.svg';
import call from '../Image/Call.svg';
import email from '../Image/Email.svg';
import Footer from '../Component/Footer';

function ContactUs() {
    return (
        <div>

            <section style={{ backgroundColor: "#060A11" }}>
                <div className='B_container_new'>

                    {/* NavBar Section Start.............. */}
                    <NavBar />
                    {/* NavBar Section End.............. */}

                </div>

                {/* Get In Touch Section Start.............. */}
                <section className='B_Get_In_Touch'>
                    <div className='text-white text-center B_Get_SEC_text'>
                        <h3 className='B_GetHead_text'>Get in touch with us</h3>
                        <p className='B_GetText mt-3' style={{ color: "#ababac" }}>Need help or have questions? Contact us - we’re here to assist you with <br /> your online meetings!</p>
                    </div>

                    <div>
                        <div className="B_contact_form">
                            <form>
                                <div className="B_form_row gap-5 ">
                                    <div className="B_form_group">
                                        <label>First Name</label>
                                        <input type="text" placeholder="Enter First Name" />
                                    </div>
                                    <div className="B_form_group">
                                        <label>Last Name</label>
                                        <input type="text" placeholder="Enter Last Name" />
                                    </div>
                                </div>
                                <div className="B_form_row gap-5">
                                    <div className="B_form_group ">
                                        <label>Email</label>
                                        <input type="email" placeholder="Enter Email" />
                                    </div>
                                    <div className="B_form_group">
                                        <label>Phone No.</label>
                                        <input type="tel" placeholder="Enter Phone No." />
                                    </div>
                                </div>
                                <div className="B_form_group">
                                    <label>Message</label>
                                    <textarea placeholder="Enter Message"></textarea>
                                </div>
                                <div className='text-center B_contact_form_button'>
                                    <button type="submit">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
                {/* Get In Touch Section End.............. */}

                {/* Address Section Start.............. */}
                <section className='B_addCARD_section'>
                    <div className='B_container_new'>
                        <div className="row g-5 B_contact_card_row">
                            <div className="col-lg-4 col-md-6 col-12 B_contact_card3">
                                <a href="#" className='text-decoration-none'>
                                    <div className="B_contact_card  text-center text-white">
                                        <div className="B_icon1 mb-4 B_contact-icon">
                                            <img src={location} alt="location" />
                                        </div>
                                        <h4 className="B_contact_card_head">Address</h4>
                                        <p>123, Lorem Ipsum Is Simply, Dummy Text  <br /> Of Printing Mumbai, Maharashra, India.</p>
                                    </div>
                                </a>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12 B_contact_card3">
                                <a href="#" className='text-decoration-none'>
                                    <div className="B_contact_card text-center text-white">
                                        <div className="B_icon2 mb-4 B_contact-icon">
                                            <img src={call} alt="phone" />
                                        </div>
                                        <h4 className="B_contact_card_head">Call Us</h4>
                                        <p>0261 5858 5858</p>
                                        <p>0261 7474 6363</p>
                                    </div>
                                </a>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12 B_contact_card3">
                                <a href="#" className='text-decoration-none'>
                                    <div className="B_contact_card  text-center text-white">
                                        <div className="B_icon3 mb-4 B_contact-icon">
                                            <img src={email} alt="email" />
                                        </div>
                                        <h4 className="B_contact_card_head">Email Us</h4>
                                        <p>example@gmail.com</p>
                                        <p>johan123@gmail.com</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Address Section End.............. */}

                {/* Footer Section Start.............. */}
                <Footer />
                {/* Footer Section End.............. */}

            </section>
        </div>
    )
}

export default ContactUs;
