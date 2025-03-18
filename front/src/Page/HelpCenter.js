import React, { useState, useEffect } from 'react'
import { IoSearch } from "react-icons/io5";
import NavBar from '../Component/NavBar';
import Footer from '../Component/Footer';
import image1 from '../Image/Account.svg';
import image2 from '../Image/Audio.svg';
import image3 from '../Image/Screen2.svg';
import image4 from '../Image/Schedule2.svg';
import image5 from '../Image/Setting.svg';

function HelpCenter() {
    const [activeFAQ, setActiveFAQ] = useState('account');

    useEffect(() => {

        window.scrollTo(0, 0);
    }, []);

    const getIconStyle = (section) => {
        if (activeFAQ === section) {
            return {
                filter: 'brightness(0) saturate(100%) invert(46%) sepia(45%) saturate(2695%) hue-rotate(199deg) brightness(93%) contrast(89%)',
            };
        }
    };

    const getTextStyle = (section) => {
        if (activeFAQ === section) {
            return { color: '#FFFFFF', cursor: 'pointer' };
        }
        return { color: '#87898B', cursor: 'pointer' };
    };


    const handleCardClick = (section) => {
        setActiveFAQ(section);
    };


    return (
        <div>

            <section style={{ backgroundColor: "#060A11" }}>
                <div className='B_container_new' >

                    {/* NavBar Section Start.............. */}
                    <NavBar />
                    {/* NavBar Section End.............. */}

                    {/* Help Center Section Start.............. */}
                    <div className='text-center text-white B_Here_Help '>
                        <h2 className='B_help_head_text'>We're here to help you </h2>
                        <div className="B_search-container mt-4" >
                            <div className="position-relative B_input_search  mx-auto">
                                <IoSearch className=' position-absolute' style={{ top: "50%", transform: "translateY(-50%)", left: "15px", fontSize: "20px", color: "rgba(255, 255, 255, 0.7)" }} />
                                <input
                                    type="text"
                                    className="form-control text-white  ps-5"
                                    placeholder="Search..."
                                    style={{ borderRadius: '5px', border: 'none', backgroundColor: "#202F41" }}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Help Center Section End.............. */}


                    {/* Card Section Start.............. */}
                    <section className='B_acc_card_section'>
                        <div className="row B_card_space text-white justify-content-center  ">
                            <div className="col-md-6 col-lg-4 col-12  B_card_space1 "
                                onClick={() => handleCardClick('account')}
                            >
                                <div className=" B_box_div text-center" style={getTextStyle('account')}>
                                    <div>
                                        <img
                                            src={image1}
                                            className='B_Cardicon'
                                            alt=""
                                            style={getIconStyle('account')}
                                        />
                                    </div>
                                    <h4 className="B_card1_head" style={getTextStyle('account')}>Account Management</h4>
                                    <p className="B_card1_text" style={getTextStyle('account')}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-4 col-12 B_card_space1"
                                onClick={() => handleCardClick('audio')}
                            >
                                <div className=" B_box_div text-center" style={getTextStyle('audio')}>
                                    <div>
                                        <img
                                            src={image2}
                                            className='B_Cardicon'
                                            alt=""
                                            style={getIconStyle('audio')}
                                        />
                                    </div>
                                    <h4 className="B_card1_head" style={getTextStyle('audio')}>Audio & Video</h4>
                                    <p className="B_card1_text" style={getTextStyle('audio')}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-4 col-12 B_card_space1"
                                onClick={() => handleCardClick('screen')}
                            >
                                <div className=" B_box_div text-center" style={getTextStyle('screen')}>
                                    <div>
                                        <img
                                            src={image3}
                                            className='B_Cardicon B_Cardicon1'
                                            alt=""
                                            style={getIconStyle('screen')}
                                        />
                                    </div>
                                    <h4 className="B_card1_head" style={getTextStyle('screen')}>Screen Sharing</h4>
                                    <p className="B_card1_text" style={getTextStyle('screen')}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-4 col-12  B_card_space1"
                                onClick={() => handleCardClick('schedule')}
                            >
                                <div className=" B_box_div text-center">
                                    <div>
                                        <img
                                            src={image4}
                                            className='B_Cardicon'
                                            alt=""
                                            style={getIconStyle('schedule')}
                                        />
                                    </div>

                                    <h4 className="B_card1_head" style={getTextStyle('schedule')}>
                                        Schedule Meeting
                                    </h4>
                                    <p className="B_card1_text" style={getTextStyle('schedule')}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-4 col-12  B_card_space1"
                                onClick={() => handleCardClick('others')}
                            >
                                <div className=" B_box_div text-center">
                                    <div>
                                        <img
                                            src={image5}
                                            className='B_Cardicon'
                                            alt=""
                                            style={getIconStyle('others')}
                                        />
                                    </div>
                                    <h4 className="B_card1_head" style={getTextStyle('others')}>Others</h4>
                                    <p className="B_card1_text" style={getTextStyle('others')}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Card Section End.............. */}


                    {/*  FAQ  Section Start .............. */}
                    <section className='B_FAQ_section'>
                        <div>
                            <h3 className='B_FAQ_head_text text-center text-white '>Frequently Asked Questions</h3>
                        </div>

                        {/*  FAQ 1 Section Start .............. */}
                        {activeFAQ === 'account' && (
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry ?
                                        </button>
                                    </h2>
                                    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16", color: "#87898B" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry ?</button>
                                    </h2>
                                    <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the secondF item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16", color: "#87898B" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                            Lorem Ipsum is simply dummy text of the printing ?</button>
                                    </h2>
                                    <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16", color: "#87898B" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting ?</button>
                                    </h2>
                                    <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16", color: "#87898B" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                            Lorem Ipsum is simply dummy text of the printing ?</button>
                                    </h2>
                                    <div id="collapseFive" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16", color: "#87898B" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting ?</button>
                                    </h2>
                                    <div id="collapseSix" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/*  FAQ 2 Section Start .............. */}
                        {activeFAQ === 'audio' && (
                            <div className="accordion" id="accordionExample2">
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne1" aria-expanded="true" aria-controls="collapseOne1">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry ?
                                        </button>
                                    </h2>
                                    <div id="collapseOne1" class="accordion-collapse collapse show" data-bs-parent="#accordionExample2">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16", color: "#87898B" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo1" aria-expanded="false" aria-controls="collapseTwo1">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry ?</button>
                                    </h2>
                                    <div id="collapseTwo1" class="accordion-collapse collapse" data-bs-parent="#accordionExample2">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the secondF item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16", color: "#87898B" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree1" aria-expanded="false" aria-controls="collapseThree1">
                                            Lorem Ipsum is simply dummy text of the printing ?</button>
                                    </h2>
                                    <div id="collapseThree1" class="accordion-collapse collapse" data-bs-parent="#accordionExample2">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16", color: "#87898B" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour1" aria-expanded="false" aria-controls="collapseFour1">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting ?</button>
                                    </h2>
                                    <div id="collapseFour1" class="accordion-collapse collapse" data-bs-parent="#accordionExample2">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/*  FAQ 3 Section Start .............. */}
                        {activeFAQ === 'screen' && (
                            <div className="accordion" id="accordionExample2">
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne2" aria-expanded="true" aria-controls="collapseOne2">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry ?
                                        </button>
                                    </h2>
                                    <div id="collapseOne2" class="accordion-collapse collapse show" data-bs-parent="#accordionExample2">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16", color: "#87898B" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo2" aria-expanded="false" aria-controls="collapseTwo2">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry ?</button>
                                    </h2>
                                    <div id="collapseTwo2" class="accordion-collapse collapse" data-bs-parent="#accordionExample2">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the secondF item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16", color: "#87898B" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree2" aria-expanded="false" aria-controls="collapseThree2">
                                            Lorem Ipsum is simply dummy text of the printing ?</button>
                                    </h2>
                                    <div id="collapseThree2" class="accordion-collapse collapse" data-bs-parent="#accordionExample2">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/*  FAQ 4 Section Start .............. */}
                        {activeFAQ === 'schedule' && (
                            <div className="accordion" id="accordionExample2">
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne3" aria-expanded="true" aria-controls="collapseOne3">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry ?
                                        </button>
                                    </h2>
                                    <div id="collapseOne3" class="accordion-collapse collapse show" data-bs-parent="#accordionExample2">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16", color: "#87898B" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo3" aria-expanded="false" aria-controls="collapseTwo3">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry ?</button>
                                    </h2>
                                    <div id="collapseTwo3" class="accordion-collapse collapse" data-bs-parent="#accordionExample2">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the secondF item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/*  FAQ 5 Section Start .............. */}
                        {activeFAQ === 'others' && (
                            <div className="accordion" id="accordionExample2">
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne4" aria-expanded="true" aria-controls="collapseOne4">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry ?
                                        </button>
                                    </h2>
                                    <div id="collapseOne4" class="accordion-collapse collapse show" data-bs-parent="#accordionExample2">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16", color: "#87898B" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo4" aria-expanded="false" aria-controls="collapseTwo4">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry ?</button>
                                    </h2>
                                    <div id="collapseTwo4" class="accordion-collapse collapse" data-bs-parent="#accordionExample2">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the secondF item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item mb-4" style={{ backgroundColor: "#090E16", color: "#87898B" }}>
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed B_FAQ_button_text text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree4" aria-expanded="false" aria-controls="collapseThree4">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry ?</button>
                                    </h2>
                                    <div id="collapseThree4" class="accordion-collapse collapse" data-bs-parent="#accordionExample2">
                                        <div class="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                                            <strong>This is the secondF item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </section>
                    {/*  FAQ  Section End.............. */}


                    {/* Footer Section Start.............. */}
                    <div className='B_Footer_section1'>
                        <Footer />
                    </div>
                    {/* Footer Section End.............. */}

                </div>
            </section>
        </div>
    )
}

export default HelpCenter;
