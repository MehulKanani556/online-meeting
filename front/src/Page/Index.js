import React, { useEffect, useState } from 'react'
import image1 from '../Image/image1.png'
import image2 from '../Image/image2.png'
import image3 from '../Image/Video.svg'
import image4 from '../Image/Scan.svg'
import image5 from '../Image/Chat.svg'
import image6 from '../Image/Upload.svg'
import image7 from '../Image/Calander.svg'
import image8 from '../Image/sharing.svg'
import image9 from '../Image/Group.png'
import image10 from '../Image/image3.png'
import image11 from '../Image/image4.png'
import { BsArrowRight } from "react-icons/bs";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import NavBar from '../Component/NavBar'
import Footer from '../Component/Footer'


function Index() {


    const options = {
        center: true,
        items: 3,
        loop: true,
        nav: true,
        margin: 20,
        dots: false,
        // autoplay: true,
        // autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 3
            }
        }
    };

    const testimonials = [
        {
            id: 1,
            img: image10,
            name: "David Smith",
            position: "Chief Executive Officer (ABC)",
            rating: 3,
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's stan Lorem Ipsum is simply dummy text of the."
        },
        {
            id: 2,
            img: image11,
            name: "David Smith",
            position: "Chief Executive Officer (ABC)",
            rating: 2,
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's stan Lorem Ipsum is simply dummy text of the."
        },
        {
            id: 3,
            img: image10,
            name: "David Smith",
            position: "Chief Executive Officer (ABC)",
            rating: 3,
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's stan Lorem Ipsum is simply dummy text of the."
        },
        {
            id: 4,
            img: image11,
            name: "David Smith",
            position: "Chief Executive Officer (ABC)",
            rating: 3,
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's stan Lorem Ipsum is simply dummy text of the."
        }
    ];

    // Generate star rating
    const renderStars = (rating) => {
        return (
            <div className='B_stars' style={{ color: "#FFD700" }} >
                {[...Array(5)].map((_, index) => (
                    <span
                        key={index}
                        className={`star ${index < rating ? 'active' : ''}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div>

            <section style={{ backgroundColor: "#060A11" }}>

                <div className='B_container_new' >
                    {/* TOP NAV BAR START.............. */}
                    <NavBar />
                    {/* TOP NAV BAR END.............. */}

                    {/* MAIN SECTION START.............. */}
                    <section className=' B_Main_section'>
                        <div className='row text-white'>
                            <div className='col-md-6 col-12  align-content-center'>
                                <h1 className='B_Head_text' >
                                    Where Innovation Meets Conversation
                                </h1>
                                <p className='mt-3 B_PTag_text' style={{ color: "#87898B" }}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's stan
                                </p>
                                <div className='B_Btn_center'>
                                    <button className="btn btn-light B_Button_text" >
                                        See how it works
                                        <span style={{ marginLeft: "8px", }}><BsArrowRight /></span>
                                    </button>
                                </div>
                            </div>
                            <div className='col-md-6 col-12'>
                                <img src={image1} alt="" />
                            </div>
                        </div>
                    </section>
                    {/* MAIN SECTION END.............. */}


                    {/* CONNECTING SECTION START.............. */}
                    <section className='B_Connecting_section text-white'>
                        <div className="row">
                            <div className="col-md-6 col-12">
                                <img src={image2} alt="" />
                            </div>

                            <div className="col-md-6 col-12 align-content-center">
                                <h2 className='B_Con_head_text'>Connecting Beyond Work</h2>

                                <p style={{ color: "#87898B" }} className='B_Connecting_text1'>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's stan Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                </p>

                                <p style={{ color: "#87898B" }} className='B_Connecting_text2'>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's stan Lorem Ipsum
                                </p>

                            </div>
                        </div>

                    </section>
                    {/* CONNECTING SECTION END.............. */}


                    {/* FEATURES SECTION START.............. */}
                    <section className='B_Features_section' style={{ backgroundColor: "#060A11" }}>
                        <div className="row text-center">
                            <div className="col-12">
                                <h2 className='B_Feature_head_text' style={{ color: "white" }}>
                                    Smart Features for smarter <br /> meetings
                                </h2>
                                <p className='B_Feature_text' style={{ color: "#87898B" }}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. <br /> Lorem Ipsum has been the industry's stan Lorem Ipsum
                                </p>
                            </div>
                        </div>
                    </section>
                    {/* FEATURES SECTION END.............. */}

                    {/* Box Section Start.............. */}
                    <section className='B_Features_section'>

                        <div className="row text-white" >
                            <div className="col-md-6 col-lg-4 col-12 mb-4">
                                <div className="B_feature-card ">
                                    <div className="B_feature-icon">
                                        <img src={image3} style={{ height: "42px", width: "53px" }} alt="" />
                                    </div>
                                    <h4 className='B_box_head'>HD video quality</h4>
                                    <p className='B_box_text' style={{ color: "#BFBFBF" }}>Lorem ipsum dolor sit amet, consectetur adipiscing <br />
                                        elit. Sed erat nibh tristique ipsum.</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 col-12 mb-4">
                                <div className="B_feature-card">
                                    <div className="B_feature-icon">
                                        <img src={image4} style={{ height: "42px", width: "50px" }} alt="" />
                                    </div>
                                    <h3 className='B_box_head'>Video recording</h3>
                                    <p className='B_box_text' style={{ color: "#87898B" }}>Lorem ipsum dolor sit amet, consectetur adipiscing <br />
                                        elit. Sed erat nibh tristique ipsum.</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 col-12 mb-4">
                                <div className="B_feature-card">
                                    <div className="B_feature-icon">
                                        <img src={image5} style={{ height: "43px", width: "50px" }} alt="" />
                                    </div>
                                    <h3 className='B_box_head'>Built-in chat</h3>
                                    <p className='B_box_text' style={{ color: "#87898B" }}>Lorem ipsum dolor sit amet, consectetur adipiscing <br />
                                        elit. Sed erat nibh tristique ipsum.</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 col-12 mb-4">
                                <div className="B_feature-card">
                                    <div className="B_feature-icon">
                                        <img src={image6} style={{ height: "38px", width: "50px" }} alt="" />
                                    </div>
                                    <h3 className='B_box_head'>Screen sharing</h3>
                                    <p className='B_box_text' style={{ color: "#87898B" }}>Lorem ipsum dolor sit amet, consectetur adipiscing <br />
                                        elit. Sed erat nibh tristique ipsum.</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 col-12 mb-4">
                                <div className="B_feature-card">
                                    <div className="B_feature-icon">
                                        <img src={image7} style={{ height: "49px", width: "50px" }} alt="" />
                                    </div>
                                    <h3 className='B_box_head'>Instant meetings</h3>
                                    <p className='B_box_text' style={{ color: "#87898B" }}>Lorem ipsum dolor sit amet, consectetur adipiscing <br />
                                        elit. Sed erat nibh tristique ipsum.</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 col-12 mb-4">
                                <div className="B_feature-card">
                                    <div className="B_feature-icon">
                                        <img src={image8} style={{ height: "55px", width: "50px" }} alt="" />
                                    </div>
                                    <h3 className='B_box_head'>File sharing</h3>
                                    <p className='B_box_text' style={{ color: "#87898B" }}>Lorem ipsum dolor sit amet, consectetur adipiscing <br />
                                        elit. Sed erat nibh tristique ipsum.</p>
                                </div>
                            </div>
                        </div>

                    </section>
                    {/* Box Section End.............. */}

                    {/* Connecting Section Start.............. */}
                    <section className='B_Connecting_section'>
                        <div className="row text-white ">
                            <div className="col-md-6 col-12 align-content-center">
                                <h2 className='B_Connecting_head_text'>Connecting teams, anywhere, anytime</h2>
                                <p className='B_Connecting_text mt-2' style={{ color: "#87898B" }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's stan Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                            </div>
                            <div className="col-md-6 col-12">
                                <img src={image9} alt="" />
                            </div>
                        </div>
                    </section>
                    {/* Connecting Section End.............. */}

                </div>
            </section>

            {/* Slider Section Start.............. */}

            <section className='B_Slider_section B_Owl ' style={{ backgroundColor: "#060A11" }} >
                <div className='B_container_new1'>
                    <div className="row text-center mb-5 text-white">
                        <div className="col-12">
                            <h2 className='B_Slider_head_text'>
                                Testimonial
                            </h2>
                            <p className='B_Slider_text' style={{ color: "#87898B" }}>
                                Your opinion matters - Let's make meeting better
                            </p>
                        </div>
                    </div>

                    <OwlCarousel className='owl-theme  text-white' {...options}>
                        {testimonials.map(testimonial => (
                            <div className='item' key={testimonial.id}>
                                <div className='testimonial-card'>
                                    <img src={testimonial.img} alt={testimonial.name} className='testimonial-image mt-2' />
                                    <h6>{testimonial.name}</h6>
                                    <p className='B_Slider_text1' style={{ color: "#87898B" }}>{testimonial.position}</p>
                                    {renderStars(testimonial.rating)}
                                    <p className='B_testimonial_text' style={{ color: "#d9dde1" }} >
                                        {testimonial.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </OwlCarousel>
                </div>
            </section>

            {/* Slider Section End.............. */}

            {/* Opacity Section Start.............. */}

            <section className='Opacity_section' style={{ backgroundColor: "#060A11", textAlign: 'center' }}>
                <div className='Opacity_img d-flex flex-column justify-content-center align-items-center'>
                    <h2 style={{ color: 'white' }} className='B_opacity_head_text'>Ready to get started?</h2>
                    <div style={{ marginTop: '20px' }}>
                        <button className="btn btn-light mx-3 B_opacity_button1 fw-semibold">Get Started</button>
                        <button className="btn btn-outline-light mx-3 B_opacity_button fw-semibold">Plans & Pricing</button>
                    </div>
                </div>
            </section>

            {/* Opacity Section End.............. */}

            {/* Footer Section Start.............. */}

            <Footer />

            {/* Footer Section End.............. */}
        </div>
    )
}

export default Index;
