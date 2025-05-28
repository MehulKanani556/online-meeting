import React, { useEffect } from 'react'
import NavBar from '../Component/NavBar';
import location from '../Image/Location.svg';
import call from '../Image/Call.svg';
import email from '../Image/Email.svg';
import Footer from '../Component/Footer';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { createcontact } from '../Redux/Slice/contactus.slice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function ContactUs() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const contactSchema = Yup.object().shape({

        firstname: Yup.string().required("First Name is required"),
        lastname: Yup.string().required("Last Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        phoneno: Yup.string()
            .required("Phone No. is required")
            .matches(/^\d{10}$/, "Phone No. must be exactly 10 digits"),
        message: Yup.string().required("message is required"),
    });


    return (
        <div>

            <section style={{ backgroundColor: "#060A11", minHeight: '100vh' }}>
                <div className='B_container_new'>

                    {/* NavBar Section Start.............. */}
                    <NavBar />
                    {/* NavBar Section End.............. */}

                </div>

                {/* Get In Touch Section Start.............. */}
                <section className='B_Get_In_Touch'>
                    <div className='text-white text-center B_Get_SEC_text'>
                        <h3 className='B_GetHead_text'>Get in touch with us</h3>
                        <p className='B_GetText mt-3' style={{ color: "#ababac" }}>Need help or have questions? Contact us - we're here to assist you with <br /> your online meetings!</p>
                    </div>

                    <div>
                        <div className="B_contact_form">

                            <Formik
                                initialValues={{
                                    firstname: '', lastname: '', email: '', phoneno: '', message: ''
                                }}
                                validationSchema={contactSchema}
                                onSubmit={(values, { resetForm }) => {
                                    dispatch(createcontact(values)).then((response) => {
                                        if (response.payload._id) {
                                            resetForm();
                                            navigate('/contactus');
                                        }
                                    });
                                }}
                            >
                                {({ values, errors, touched, handleChange, setFieldValue }) => (
                                    <Form>
                                        <div className="B_form_row gap-5 ">
                                            <div className="B_form_group">
                                                <label>First Name</label>
                                                <Field name="firstname" type="text" placeholder="Enter First Name" value={values.firstname} onChange={handleChange} />
                                                <ErrorMessage name="firstname" component="div" style={{ color: '#cd1425', fontSize: '14px', marginTop: '5px' }} />
                                            </div>
                                            <div className="B_form_group">
                                                <label>Last Name</label>
                                                <Field name="lastname" type="text" placeholder="Enter Last Name" value={values.lastname} onChange={handleChange} />
                                                <ErrorMessage name="lastname" component="div" style={{ color: '#cd1425', fontSize: '14px', marginTop: '5px' }} />
                                            </div>
                                        </div>
                                        <div className="B_form_row gap-5">
                                            <div className="B_form_group ">
                                                <label>Email</label>
                                                <Field name="email" type="email" placeholder="Enter Email" value={values.email} onChange={handleChange} />
                                                <ErrorMessage name="email" component="div" style={{ color: '#cd1425', fontSize: '14px', marginTop: '5px' }} />
                                            </div>
                                            <div className="B_form_group">
                                                <label>Phone No.</label>
                                                <Field name="phoneno" type="tel" placeholder="Enter Phone No." value={values.phoneno} onChange={handleChange} />
                                                <ErrorMessage name="phoneno" component="div" style={{ color: '#cd1425', fontSize: '14px', marginTop: '5px' }} />
                                            </div>
                                        </div>
                                        <div className="B_form_group">

                                            <label>Message</label>

                                            <Field
                                                as="textarea"
                                                name="message"
                                                placeholder="Enter Message"
                                                value={values.message}
                                                onChange={handleChange}
                                            />
                                            <ErrorMessage name="message" component="div" style={{ color: '#cd1425', fontSize: '14px', marginTop: '5px' }} />
                                        </div>
                                        <div className='text-center B_contact_form_button'>
                                            <button type="submit">Submit</button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
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
                                <div className="B_contact_card text-center text-white">
                                    <div className="B_icon2 mb-4 B_contact-icon">
                                        <img src={call} alt="phone" />
                                    </div>
                                    <h4 className="B_contact_card_head">Call Us</h4>
                                    <a href="tel:0261 5858 5858" className='text-decoration-none'>
                                        <p>0261 5858 5858</p>
                                    </a>
                                    <a href="tel:0261 7474 6363" className='text-decoration-none'>
                                        <p>0261 7474 6363</p>
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-12 B_contact_card3">
                                <div className="B_contact_card  text-center text-white">
                                    <div className="B_icon3 mb-4 B_contact-icon">
                                        <img src={email} alt="email" />
                                    </div>
                                    <h4 className="B_contact_card_head">Email Us</h4>
                                    <a href="mailto:example@gmail.com" className='text-decoration-none'>
                                        <p>example@gmail.com</p>
                                    </a>
                                    <a href="mailto:johan123@gmail.com" className='text-decoration-none'>
                                        <p>johan123@gmail.com</p>
                                    </a>
                                </div>
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
