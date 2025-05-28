import React from 'react'
import logo from '../Image/logo.svg'
import image12 from '../Image/Facebook.svg'
import image13 from '../Image/Twitter.svg'
import image14 from '../Image/Instagram.svg'
import image15 from '../Image/Linkedin.svg'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <div>
            <section className='B_Footer_section' style={{ backgroundColor: "#060A11" }}>
                <div className='B_container_new' >
                    <div className='d-flex B_Footer_container justify-content-between align-items-center'>
                        <div>
                            <a href="/" style={{ textDecoration: "none" }}><img src={logo} alt="Logo" style={{ height: "30px", width: "45px" }} /></a>

                            <div className='B_footer-links d-flex gap-4 mt-4' style={{ color: "#d2d7dd" }} >

                                <Link to={"/helpcenter"} className='text-decoration-none'>
                                    <p className='B_footer_hover'><a href="" className='text-decoration-none' style={{ color: "#d2d7dd" }}>Help center</a></p>
                                </Link>

                                <Link to={'/pricing'} className='text-decoration-none' >
                                    <p className='B_footer_hover'><a href="" className='text-decoration-none' style={{ color: "#d2d7dd" }}>Pricing</a></p>
                                </Link>

                                <Link to={'/contactus'} className='text-decoration-none'>
                                    <p className='B_footer_hover'><a href="" className='text-decoration-none' style={{ color: "#d2d7dd" }}>Contact us</a></p>
                                </Link>

                            </div>
                            <div>
                                <p className='B_Footer_text' style={{ color: "#87898B" }}>&copy; {new Date().getFullYear()} Gentler Streak. All rights reserved</p>
                            </div>
                        </div>

                        <div>
                            <h5 style={{ color: "#d2d7dd" }} >Keep in touch</h5>
                            <div className='d-flex B_footer_link1  gap-3 mt-3'>
                                <div className="B_social_icon" >
                                    <img src={image12} alt="Facebook" />
                                </div>
                                <div className="B_social_icon" >
                                    <img src={image13} alt="Twitter" />
                                </div>
                                <div className="B_social_icon" >
                                    <img src={image14} alt="Instagram" />
                                </div>
                                <div className="B_social_icon" >
                                    <img src={image15} alt="LinkedIn" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Footer
