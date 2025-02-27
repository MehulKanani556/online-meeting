import React, { useState } from 'react'
import logo from '../Image/logo.svg'
import image1 from '../Image/image1.png'
import image2 from '../Image/image2.png'
import image3 from '../Image/Video.svg'
import image4 from '../Image/Scan.svg'
import image5 from '../Image/Chat.svg'
import image6 from '../Image/Upload.svg'
import image7 from '../Image/Calander.svg'
import image8 from '../Image/sharing.svg'
import image9 from '../Image/Group.png'
import { BsArrowRight } from "react-icons/bs";

function Home() {
  const [activeLink, setActiveLink] = useState('Home')

  return (
    <div>

      <section style={{ backgroundColor: "#060A11" }}>

        <div className='container_new' >

          {/* TOP NAV BAR START.............. */}

          <nav className="navbar navbar-expand-lg py-4" >
            <div className="container-fluid ">
              <a className="navbar-brand text-white" href="#">
                <img src={logo} style={{ height: "30px", width: "35 px" }} alt="" />
              </a>

              <button className="navbar-toggler text-white   " style={{ boxShadow: "0 0 4px 2px white" }} type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon " style={{ backgroundColor: 'white', height: '25px', width: '25px' }}></span>
              </button>

              <div className="collapse navbar-collapse " id="navbarText">

                <ul className="navbar-nav me-auto mb-2 mb-lg-0 m-auto gap-lg-5" >
                  {['Home', 'Help Center', 'Pricing', 'Contact Us'].map((item) => (
                    <li className="nav-item" key={item}>
                      <a
                        className={`nav-link ${activeLink === item ? 'active' : ''} UL_text`}
                        style={{
                          color: activeLink === item ? 'white' : '#BFBFBF',
                          borderBottom: activeLink === item ? '2px solid white' : 'none',
                          paddingBottom: "5px",
                          width: "fit-content",
                          fontWeight: "500",
                        }}
                        onClick={() => setActiveLink(item)}
                        href="#"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>

                <button className="btn btn-outline-light px-4 py-2">
                  Get Started
                </button>

              </div>
            </div>
          </nav>
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
                <button className="btn btn-light B_Button_text" >
                  See how it works
                  <span style={{ marginLeft: "8px", }}><BsArrowRight /></span>
                </button>
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
                <div className="feature-card ">
                  <div className="feature-icon">
                    <img src={image3} style={{ height: "42px", width: "53px" }} alt="" />
                  </div>
                  <h4 className='B_box_head'>HD video quality</h4>
                  <p className='B_box_text' style={{ color: "#BFBFBF" }}>Lorem ipsum dolor sit amet, consectetur adipiscing <br />
                    elit. Sed erat nibh tristique ipsum.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-12 mb-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <img src={image4} style={{ height: "42px", width: "50px" }} alt="" />
                  </div>
                  <h3 className='B_box_head'>Video recording</h3>
                  <p className='B_box_text' style={{ color: "#87898B" }}>Lorem ipsum dolor sit amet, consectetur adipiscing <br />
                    elit. Sed erat nibh tristique ipsum.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-12 mb-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <img src={image5} style={{ height: "43px", width: "50px" }} alt="" />
                  </div>
                  <h3 className='B_box_head'>Built-in chat</h3>
                  <p className='B_box_text' style={{ color: "#87898B" }}>Lorem ipsum dolor sit amet, consectetur adipiscing <br />
                    elit. Sed erat nibh tristique ipsum.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-12 mb-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <img src={image6} style={{ height: "38px", width: "50px" }} alt="" />
                  </div>
                  <h3 className='B_box_head'>Screen sharing</h3>
                  <p className='B_box_text' style={{ color: "#87898B" }}>Lorem ipsum dolor sit amet, consectetur adipiscing <br />
                    elit. Sed erat nibh tristique ipsum.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-12 mb-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <img src={image7} style={{ height: "49px", width: "50px" }} alt="" />
                  </div>
                  <h3 className='B_box_head'>Instant meetings</h3>
                  <p className='B_box_text' style={{ color: "#87898B" }}>Lorem ipsum dolor sit amet, consectetur adipiscing <br />
                    elit. Sed erat nibh tristique ipsum.</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-12 mb-4">
                <div className="feature-card">
                  <div className="feature-icon">
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
    </div>
  )
}

export default Home;
