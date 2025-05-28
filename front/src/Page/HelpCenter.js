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
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredFAQs, setFilteredFAQs] = useState({});

    // FAQ data structure for easy searching
    const faqData = {
        account: [
            {
                id: 'collapseOne',
                question: 'How do I create a new account?',
                answer: 'Click "Log In" on Right side corner and follow the Log In instructions.'
            },
            {
                id: 'collapseTwo',
                question: 'Can I change my registered email address?',
                answer: 'No, you cannot change your registered email address.'
            },
            {
                id: 'collapseThree',
                question: 'How do I reset my password?',
                answer: 'Click "Forgot Password" on the Home screen and follow the reset instructions.'
            },
            {
                id: 'collapseFour',
                question: 'Where can I update my profile picture or name?',
                answer: 'Under Account Settings, click "Edit Profile" to change your display name or upload a new photo and also add your Display name.'
            },
            {
                id: 'collapseFive',
                question: 'How do I delete my account?',
                answer: 'No, you cannot delete your account.'
            }
        ],
        audio: [
            {
                id: 'collapseOne1',
                question: 'Why can\'t others hear or see me?',
                answer: 'Check that your mic/camera isn\'t muted or blocked by your browser settings.'
            },
            {
                id: 'collapseTwo1',
                question: 'Can I switch devices during a meeting?',
                answer: 'No, you cannot switch devices during a meeting.'
            },
            {
                id: 'collapseThree1',
                question: 'How do I blur or change my background?',
                answer: 'No, you cannot blur or change your background.'
            }
        ],
        screen: [
            {
                id: 'collapseOne2',
                question: 'How do I start screen sharing?',
                answer: 'Click the "Share Screen" button in the meeting toolbar and choose what you want to share.'
            },
            {
                id: 'collapseTwo2',
                question: 'Can I allow others to share their screen?',
                answer: 'Yes, as a host, go to Settings → Permissions and enable screen sharing for participants.'
            },
            {
                id: 'collapseThree2',
                question: 'Why is my screen not visible to others?',
                answer: 'Ensure you\'ve granted permission to your browser and selected the correct window/tab.'
            }
        ],
        schedule: [
            {
                id: 'collapseOne3',
                question: 'How do I schedule a meeting in advance?',
                answer: 'Click "Schedule" on the homepage, pick a date/time, and send invites to attendees.'
            },
            {
                id: 'collapseTwo3',
                question: 'Can I make it a recurring meeting?',
                answer: 'Yes, during scheduling, select the "Repeat" option and set your recurrence pattern.'
            },
            {
                id: 'collapseThree3',
                question: 'Can I edit or cancel a scheduled meeting?',
                answer: 'Go to "Schedule," select the one you want to change, and click "Edit" or "Cancel."'
            }
        ],
        others: [
            {
                id: 'collapseOne4',
                question: 'Does this app support chat during meetings?',
                answer: 'Yes, click the "Bar" icon in the toolbar to send messages to individuals or everyone.'
            },
            {
                id: 'collapseTwo4',
                question: 'Can I record a meeting?',
                answer: 'Yes, you can record a meeting. To do this, click the "Record" button in the meeting toolbar.'
            },
            {
                id: 'collapseThree4',
                question: 'What browsers are supported?',
                answer: 'We recommend the latest versions of Chrome, Firefox, or Edge for the best experience.'
            }
        ]
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredFAQs({});
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = {};

        Object.keys(faqData).forEach(category => {
            const matchingFAQs = faqData[category].filter(faq =>
                faq.question.toLowerCase().includes(query) ||
                faq.answer.toLowerCase().includes(query)
            );

            if (matchingFAQs.length > 0) {
                filtered[category] = matchingFAQs;
            }
        });

        setFilteredFAQs(filtered);
    }, [searchQuery]);

    const handleCardClick = (section) => {
        setActiveFAQ(section);
        setSearchQuery(''); // Clear search when clicking on category
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

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

    // Function to render FAQ items
    const renderFAQItem = (faq, index, parentId) => (
        <div key={faq.id} className="accordion-item mb-4" style={{ backgroundColor: "#090E16" }}>
            <h2 className="accordion-header">
                <button
                    className={`accordion-button ${index !== 0 ? 'collapsed' : ''} B_FAQ_button_text text-white`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${faq.id}`}
                    aria-expanded={index === 0 ? "true" : "false"}
                    aria-controls={faq.id}
                >
                    {faq.question}
                </button>
            </h2>
            <div
                id={faq.id}
                className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                data-bs-parent={`#${parentId}`}
            >
                <div className="accordion-body B_FAQ_body_text" style={{ color: "#87898B" }}>
                    {faq.answer}
                </div>
            </div>
        </div>
    );

    // Function to render search results
    const renderSearchResults = () => {
        if (Object.keys(filteredFAQs).length === 0) {
            return (
                <div className="text-center text-white py-5">
                    <p>No results found for "{searchQuery}"</p>
                    <p className="opacity-50">Try different keywords or browse categories above</p>
                </div>
            );
        }

        return Object.keys(filteredFAQs).map(category => (
            <div key={category} className="mb-5">
                <h4 className="text-white mb-3 text-capitalize">{category} Questions ({filteredFAQs[category].length})</h4>
                <div className="accordion" id={`searchAccordion${category}`}>
                    {filteredFAQs[category].map((faq, index) =>
                        renderFAQItem(faq, index, `searchAccordion${category}`)
                    )}
                </div>
            </div>
        ));
    };

    return (
        <div>
            <section style={{ backgroundColor: "#060A11", minHeight: '100vh' }}>
                <div className='B_container_new'>

                    {/* NavBar Section Start.............. */}
                    <NavBar />
                    {/* NavBar Section End.............. */}

                    {/* Help Center Section Start.............. */}
                    <div className='text-center text-white B_Here_Help'>
                        <h2 className='B_help_head_text'>We're here to help you</h2>
                        <div className="B_search-container mt-4">
                            <div className="position-relative B_input_search mx-auto">
                                <IoSearch className='position-absolute' style={{ top: "50%", transform: "translateY(-50%)", left: "15px", fontSize: "20px", color: "rgba(255, 255, 255, 0.7)" }} />
                                <input
                                    type="text"
                                    className="form-control text-white ps-5"
                                    placeholder="Search FAQ questions and answers..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    style={{ borderRadius: '5px', border: 'none', backgroundColor: "#202F41" }}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Help Center Section End.............. */}

                    {/* Show search results or category cards */}
                    {searchQuery.trim() ? (
                        <section className='B_FAQ_section'>
                            <div>
                                <h3 className='B_FAQ_head_text text-center text-white'>Search Results</h3>
                            </div>
                            {renderSearchResults()}
                        </section>
                    ) : (
                        <>
                            {/* Card Section Start.............. */}
                            <section className='B_acc_card_section'>
                                <div className="row B_card_space text-white justify-content-center">
                                    <div className="col-md-6 col-lg-4 col-12 B_card_space1" onClick={() => handleCardClick('account')}>
                                        <div className="B_box_div text-center" style={getTextStyle('account')}>
                                            <div>
                                                <img src={image1} className='B_Cardicon' alt="" style={getIconStyle('account')} />
                                            </div>
                                            <h4 className="B_card1_head" style={getTextStyle('account')}>Account Management</h4>
                                            <p className="B_card1_text" style={getTextStyle('account')}>
                                                Manage your profile, preferences, and security settings for a seamless meeting experience.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-lg-4 col-12 B_card_space1" onClick={() => handleCardClick('audio')}>
                                        <div className="B_box_div text-center" style={getTextStyle('audio')}>
                                            <div>
                                                <img src={image2} className='B_Cardicon' alt="" style={getIconStyle('audio')} />
                                            </div>
                                            <h4 className="B_card1_head" style={getTextStyle('audio')}>Audio & Video</h4>
                                            <p className="B_card1_text" style={getTextStyle('audio')}>
                                                Get help with your microphone, speakers, camera setup, and common troubleshooting steps.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-lg-4 col-12 B_card_space1" onClick={() => handleCardClick('screen')}>
                                        <div className="B_box_div text-center" style={getTextStyle('screen')}>
                                            <div>
                                                <img src={image3} className='B_Cardicon B_Cardicon1' alt="" style={getIconStyle('screen')} />
                                            </div>
                                            <h4 className="B_card1_head" style={getTextStyle('screen')}>Screen Sharing</h4>
                                            <p className="B_card1_text" style={getTextStyle('screen')}>
                                                Learn how to share your screen, switch windows, and optimize for better visibility.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-lg-4 col-12 B_card_space1" onClick={() => handleCardClick('schedule')}>
                                        <div className="B_box_div text-center">
                                            <div>
                                                <img src={image4} className='B_Cardicon' alt="" style={getIconStyle('schedule')} />
                                            </div>
                                            <h4 className="B_card1_head" style={getTextStyle('schedule')}>
                                                Schedule Meeting
                                            </h4>
                                            <p className="B_card1_text" style={getTextStyle('schedule')}>
                                                Find out how to create, edit, and invite others to meetings with flexible scheduling options.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-md-6 col-lg-4 col-12 B_card_space1" onClick={() => handleCardClick('others')}>
                                        <div className="B_box_div text-center">
                                            <div>
                                                <img src={image5} className='B_Cardicon' alt="" style={getIconStyle('others')} />
                                            </div>
                                            <h4 className="B_card1_head" style={getTextStyle('others')}>Others</h4>
                                            <p className="B_card1_text" style={getTextStyle('others')}>
                                                Explore additional support topics including integrations, notifications, and accessibility.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* Card Section End.............. */}

                            {/* FAQ Section Start.............. */}
                            <section className='B_FAQ_section'>
                                <div>
                                    <h3 className='B_FAQ_head_text text-center text-white'>Frequently Asked Questions</h3>
                                </div>

                                {/* FAQ 1 Section - Account */}
                                {activeFAQ === 'account' && (
                                    <div className="accordion" id="accordionExample">
                                        {faqData.account.map((faq, index) => renderFAQItem(faq, index, 'accordionExample'))}
                                    </div>
                                )}

                                {/* FAQ 2 Section - Audio */}
                                {activeFAQ === 'audio' && (
                                    <div className="accordion" id="accordionExample2">
                                        {faqData.audio.map((faq, index) => renderFAQItem(faq, index, 'accordionExample2'))}
                                    </div>
                                )}

                                {/* FAQ 3 Section - Screen */}
                                {activeFAQ === 'screen' && (
                                    <div className="accordion" id="accordionExample3">
                                        {faqData.screen.map((faq, index) => renderFAQItem(faq, index, 'accordionExample3'))}
                                    </div>
                                )}

                                {/* FAQ 4 Section - Schedule */}
                                {activeFAQ === 'schedule' && (
                                    <div className="accordion" id="accordionExample4">
                                        {faqData.schedule.map((faq, index) => renderFAQItem(faq, index, 'accordionExample4'))}
                                    </div>
                                )}

                                {/* FAQ 5 Section - Others */}
                                {activeFAQ === 'others' && (
                                    <div className="accordion" id="accordionExample5">
                                        {faqData.others.map((faq, index) => renderFAQItem(faq, index, 'accordionExample5'))}
                                    </div>
                                )}
                            </section>
                            {/* FAQ Section End.............. */}
                        </>
                    )}

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