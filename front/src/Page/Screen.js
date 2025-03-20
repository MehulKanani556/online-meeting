import React, { useEffect, useState } from 'react';
import './../CSS/darshan.css';
import onmicrophone from '../Image/d_onmicrophone.svg';
import offmicrophone from '../Image/d_offmicrophone.svg';
import oncamera from '../Image/d_oncamera.svg';
import offcamera from '../Image/d_offcamera.svg';
import upload from '../Image/d_upload.svg';
import target from '../Image/d_target.svg';
import smile from '../Image/d_smile.svg';
import podcast from '../Image/d_podcast.svg';
import hand from '../Image/d_hand.svg';
import bar from '../Image/d_bar.svg';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { HiOutlineUserPlus } from "react-icons/hi2";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoClose, IoSearch } from 'react-icons/io5'
import { IoMdSend } from "react-icons/io";


function Screen() {
    const [isMicrophoneOn, setMicrophoneOn] = useState(false);
    const [isCameraOn, setCameraOn] = useState(false);
    const [showAllParticipants, setShowAllParticipants] = useState(false);
    const [showViewMoreDropdown, setShowViewMoreDropdown] = useState(false);
    const [isMicrophoneOn1, setMicrophoneOn1] = useState(false);
    const [billingCycle, setBillingCycle] = useState('Messages');
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    const toggleMicrophone1 = (participantId) => {
        setParticipants(prevParticipants =>
            prevParticipants.map(participant =>
                participant.id === participantId
                    ? { ...participant, isMicrophoneOn: !participant.isMicrophoneOn }
                    : participant
            )
        );
    };


    const toggleMicrophone = () => {
        setMicrophoneOn(!isMicrophoneOn);
    };

    const toggleCamera = () => {
        setCameraOn(!isCameraOn);
    };

    const toggleParticipantsList = () => {
        setShowAllParticipants(!showAllParticipants);
    };

    const toggleViewMoreDropdown = () => {
        setShowViewMoreDropdown(!showViewMoreDropdown);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showViewMoreDropdown && !event.target.closest('.d_dropdown') && !event.target.closest('.d_box1')) {
                setShowViewMoreDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showViewMoreDropdown]);

    const [participants, setParticipants] = useState([
        { id: 1, name: 'Johan Kumar', initials: 'JK', hasVideo: false, hasAudio: true },
        // Comment or uncomment participants to test different layouts
        { id: 2, name: 'Lisa Nihar', initials: 'LN', hasVideo: true, hasAudio: false },
        { id: 3, name: 'Kiara Patel', initials: 'KP', hasVideo: false, hasAudio: true },
        { id: 4, name: 'Rohan Patel', initials: 'RP', hasVideo: false, hasAudio: true },
        { id: 5, name: 'Vikram Gupta', initials: 'VG', hasVideo: false, hasAudio: true },
        { id: 6, name: 'Another User', initials: 'AU', hasVideo: false, hasAudio: true },
        { id: 7, name: 'User Seven', initials: 'US', hasVideo: false, hasAudio: true },
        { id: 8, name: 'User Eight', initials: 'UE', hasVideo: false, hasAudio: true },
        { id: 9, name: 'User Nine', initials: 'UN', hasVideo: false, hasAudio: true },
        { id: 10, name: 'User Nine', initials: 'UN', hasVideo: false, hasAudio: true },
        { id: 11, name: 'User Nine', initials: 'UN', hasVideo: false, hasAudio: true },
        { id: 12, name: 'User Nine', initials: 'UN', hasVideo: false, hasAudio: true },
        { id: 13, name: 'User Nine', initials: 'UN', hasVideo: false, hasAudio: true },
    ]);

    // One person with video on (for testing)
    const hasVideoParticipant = participants.find(p => p.id === 4);
    if (hasVideoParticipant) {
        hasVideoParticipant.hasVideo = true;
    }

    // Calculate grid columns based on participant count
    const getGridColumns = () => {
        const count = participants.length;
        if (window.innerWidth <= 425) {
            return 2; // Always use 2 columns for small mobile screens
        }
        if (count === 1) return 1;
        if (count === 2) return 2;
        if (count <= 4) return 2;
        return 3;
    };

    // Calculate grid class based on participant count
    const getGridClass = () => {
        const count = participants.length;
        if (count === 1) return 'single-participant';
        if (count === 2) return 'two-participants';
        if (count <= 4) return 'four-participants';
        return 'multi-participants';
    };

    // Add useEffect to handle window resize
    const [maxVisibleParticipants, setMaxVisibleParticipants] = useState(9);

    // useEffect(() => {
    //     const handleResize = () => {
    //         if (window.innerWidth <= 425) {
    //             setMaxVisibleParticipants(6); // Show 6 participants on small screens
    //         } else if (window.innerWidth <= 576) {
    //             setMaxVisibleParticipants(6);
    //         } else if (window.innerWidth <= 992) {
    //             setMaxVisibleParticipants(6);
    //         } else {
    //             setMaxVisibleParticipants(9);
    //         }
    //     };

    //     // Set initial value
    //     handleResize();

    //     // Add event listener
    //     window.addEventListener('resize', handleResize);

    //     // Clean up
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

    useEffect(() => {
        const handleResize = () => {
            setMaxVisibleParticipants(window.innerWidth <= 425 ? 6 : 9);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get visible participants
    const visibleParticipants = participants.slice(0, maxVisibleParticipants);
    const extraParticipants = participants.length > maxVisibleParticipants ?
        participants.length - (maxVisibleParticipants - 1) : 0;

    return (
        <>
            <section className="d_mainsec">
                <div className="d_topbar"></div>
                <div className="d_mainscreen">
                    <div className={`d_participants-grid ${getGridClass()}`}
                        style={{ gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)` }}>
                        {visibleParticipants.map((participant, index) => (
                            <div key={participant.id} className="d_grid-item">
                                <div className="d_avatar-container">
                                    {participant.hasVideo ? (
                                        <video
                                            src={require('../Image/video.mp4')}
                                            alt={participant.name}
                                            className="d_video-element"
                                            autoPlay
                                            muted
                                            loop
                                        />
                                    ) : (
                                        <div
                                            className="d_avatar-circle"
                                            style={{
                                                backgroundColor: `hsl(${participant.id * 60}, 70%, 45%)`
                                            }}
                                        >
                                            {participant.initials}
                                        </div>
                                    )}
                                    <div className="d_controls-top">
                                        <div className="d_controls-container">
                                            <img src={hand} className="d_control-icon" alt="Raise hand" />
                                            {participant.hasVideo ? (
                                                <img src={oncamera} className="d_control-icon" alt="Camera on" />
                                            ) : (
                                                <img src={offcamera} className="d_control-icon" alt="Camera off" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="d_controls-bottom">
                                        <span className="d_participant-name">{participant.name}</span>
                                        <div className="d_mic-status">
                                            {participant.hasAudio ? (
                                                <img src={onmicrophone} className="d_control-icon" alt="Microphone on" />
                                            ) : (
                                                <img src={offmicrophone} className="d_control-icon" alt="Microphone off" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Display extra participants indicator */}
                                {index === maxVisibleParticipants - 1 && extraParticipants > 0 && (
                                    <div
                                        onClick={handleShow}
                                        className="d_extra-participants"
                                    >
                                        <span>+{extraParticipants} others</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="d_bottombar" style={{ cursor: "pointer" }}>
                    <div className="d-flex justify-content-sm-between justify-content-center align-items-center">
                        {/* 1st div */}
                        <div className='d-none d-sm-block'>
                            <div className="d-flex align-items-center d_resposive">
                                <div className="d_box me-sm-3 mb-2 mb-sm-0" onClick={toggleMicrophone}>
                                    <img src={isMicrophoneOn ? onmicrophone : offmicrophone} alt="" />
                                </div>
                                <div className="d_box" onClick={toggleCamera}>
                                    <img src={isCameraOn ? oncamera : offcamera} alt="" />
                                </div>
                            </div>
                        </div>

                        {/* New Div */}
                        <div className="d-flex align-items-center">
                            <div className='d-none d-sm-block'>
                                <div className='d-flex d_resposive'>
                                    <div className="d_box me-sm-3 mb-2 mb-sm-0">
                                        <img src={upload} alt="" />
                                    </div>
                                    <div className="d_box me-sm-3">
                                        <img src={target} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="d_box1 me-sm-3 mx-3 mx-sm-0 d_red" style={{ cursor: "pointer" }} >
                                <p className="mb-0">End Meeting</p>
                            </div>
                            <div className="position-relative">
                                <div
                                    className="d-block d-sm-none d_box1 me-sm-3 mx-3 mx-sm-0"
                                    style={{ cursor: "pointer" }}
                                    onClick={toggleViewMoreDropdown}
                                >
                                    <p className="mb-0">View More</p>
                                </div>
                                {showViewMoreDropdown && window.innerWidth <= 425 && (
                                    <div className="d_dropdown position-absolute bottom-100 start-50 translate-middle-x mb-2 rounded shadow-lg p-2"
                                        style={{ minWidth: '200px', zIndex: 1000 }}>
                                        <div className="d-flex align-items-center p-2">
                                            <img src={isMicrophoneOn ? onmicrophone : offmicrophone} className="me-2" alt="" />
                                            <span>Microphone</span>
                                        </div>
                                        <div className="d-flex align-items-center p-2">
                                            <img src={isCameraOn ? oncamera : offcamera} className="me-2" alt="" />
                                            <span>Camera</span>
                                        </div>
                                        <div className="d-flex align-items-center p-2">
                                            <img src={upload} alt="" className="me-2" />
                                            <span>Share Screen</span>
                                        </div>
                                        <div className="d-flex align-items-center p-2">
                                            <img src={target} alt="" className="me-2" />
                                            <span>Record</span>
                                        </div>
                                        <div className="d-flex align-items-center p-2">
                                            <img src={smile} alt="" className="me-2" />
                                            <span>Reactions</span>
                                        </div>
                                        <div className="d-flex align-items-center p-2">
                                            <img src={podcast} alt="" className="me-2" />
                                            <span>Audio Settings</span>
                                        </div>
                                        <div className="d-flex align-items-center p-2">
                                            <img src={hand} alt="" className="me-2" />
                                            <span>Raise Hand</span>
                                        </div>
                                        <div className="d-flex align-items-center p-2">
                                            <img src={bar} alt="" className="me-2" />
                                            <span>Chat</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='d-none d-sm-block'>
                                <div className='d-flex d_resposive'>
                                    <div className="d_box me-sm-3 mb-2 mb-sm-0">
                                        <img src={smile} alt="" />
                                    </div>
                                    <div className="d_box me-sm-3">
                                        <img src={podcast} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 3rd div */}
                        <div className='d-none d-sm-block'>
                            <div className="d-flex align-items-center d_resposive">
                                <div className="d_box me-sm-3 mb-2 mb-sm-0">
                                    <img src={hand} alt="" />
                                </div>
                                <div className="d_box">
                                    <img src={bar} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Offcanvas  */}

            <Offcanvas show={show} className='B_screen_offcanvas' placement='end' onHide={handleClose}>

                <Offcanvas.Header className='d-flex justify-content-between align-items-center' >
                    <div className='d-flex justify-content-center ms-3 py-2' >
                        <div className='d-flex' style={{ backgroundColor: '#101924', padding: '6px', borderRadius: '8px' }}>
                            <button
                                type="button"
                                className=" B_screen_button border-0 rounded"
                                style={{
                                    minWidth: '100px',
                                    backgroundColor: billingCycle === 'Messages' ? '#2A323B' : 'transparent',
                                    color: billingCycle === 'Messages' ? '#ffffff' : '#87898B'
                                }}
                                onClick={() => setBillingCycle('Messages')}
                            >
                                Messages (3)
                            </button>
                            <button
                                type="button"
                                className=" B_screen_button border-0 rounded"
                                style={{
                                    minWidth: '100px',
                                    backgroundColor: billingCycle === 'Participants' ? '#2A323B' : 'transparent',
                                    color: billingCycle === 'Participants' ? '#ffffff' : '#87898B'
                                }}
                                onClick={() => setBillingCycle('Participants')}
                            >
                                Participants (4)
                            </button>
                        </div>
                    </div>

                    <IoClose
                        style={{ color: '#fff', fontSize: '20px', marginBottom: "20px", cursor: 'pointer' }}
                        onClick={handleClose}
                    />
                </Offcanvas.Header>
                <div className='mx-2 mb-4' style={{ borderBottom: "1px solid #3f464e" }}></div>



                {billingCycle === 'Participants' ? (
                    <Offcanvas.Body >
                        <>
                            <div className='d-flex flex-column h-100'>
                                <div className="B_search-container  mb-3" >
                                    <div className="position-relative B_input_search B_input_search11  mx-auto">
                                        <IoSearch className=' position-absolute' style={{ top: "50%", transform: "translateY(-50%)", left: "15px", fontSize: "20px", color: "rgba(255, 255, 255, 0.7)" }} />
                                        <input
                                            type="text"
                                            className="form-control text-white  ps-5"
                                            placeholder="Search..."
                                            style={{ borderRadius: '5px', border: 'none', backgroundColor: "#202F41" }}
                                        />
                                    </div>
                                </div>
                                <div className="list-group B_screen_offcanvas " style={{ height: "82%", overflowY: "auto" }}>
                                    {participants.map((participant) => (
                                        <div key={participant.id} className="list-group-item d-flex align-items-center">
                                            <div className="rounded-circle d-flex justify-content-center align-items-center me-3"
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    backgroundColor: `hsl(${participant.id * 60}, 70%, 45%)`,
                                                    color: 'white'
                                                }}>
                                                {participant.initials}
                                            </div>
                                            <div className="flex-grow-1">
                                                <div>{participant.name}</div>
                                            </div>
                                            <div className="d-flex align-items-center ">
                                                <div className="d_box me-sm-3 mb-2 mb-sm-0" onClick={() => toggleMicrophone1(participant.id)}>
                                                    <img src={participant.isMicrophoneOn ? onmicrophone : offmicrophone} alt="" />
                                                </div>
                                                <HiOutlineDotsVertical className='mt-1' />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='d-flex justify-content-center mb-3 mt-auto' >
                                    <Button className='B_screen_btn fw-semibold p-2'> <HiOutlineUserPlus className='fw-bold' style={{ fontSize: "20px" }} /> Invite people </Button>
                                    <Button className='B_screen_btn fw-semibold p-2'> Mute all </Button>
                                </div>

                            </div>
                        </>


                    </Offcanvas.Body>
                ) : (
                    <Offcanvas.Body >
                        <>
                            <div className="chat-container h-100 d-flex flex-column">
                                <div className="chat-messages flex-grow-1" style={{ overflowY: 'auto' }}>
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="chat-avatar me-2" style={{ backgroundColor: '#2B7982', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: '#fff' }}>LN</span>
                                        </div>
                                        <div>
                                            <div className="chat-name" style={{ color: '#fff', fontSize: '14px' }}>Lisa</div>
                                            <div className="chat-message" style={{ backgroundColor: '#1E242B', color: '#B3AEAE', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px', marginTop: '4px' }}>
                                                Can u hear my voice
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end mb-3">
                                        <div className="chat-message" style={{ backgroundColor: '#2A323B', color: '#fff', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px' }}>
                                            Ok, wait, 5 min
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-start mb-3">
                                        <div className="chat-avatar me-2" style={{ backgroundColor: '#2B7982', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: '#fff' }}>LN</span>
                                        </div>
                                        <div>
                                            <div className="chat-name" style={{ color: '#fff', fontSize: '14px' }}>Lisa</div>
                                            <div className="chat-message" style={{ backgroundColor: '#1E242B', color: '#B3AEAE', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px', marginTop: '4px' }}>
                                                Thanks....
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-start mb-3">
                                        <div className="chat-avatar me-2" style={{ backgroundColor: '#382B82', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: '#fff' }}>KP</span>
                                        </div>
                                        <div>
                                            <div className="chat-name" style={{ color: '#fff', fontSize: '14px' }}>Kiara</div>
                                            <div className="chat-message" style={{ backgroundColor: '#1E242B', color: '#B3AEAE', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px', marginTop: '4px' }}>
                                                Lorem ipsum is simply dummy
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end mb-3">
                                        <div className="chat-message" style={{ backgroundColor: '#2A323B', color: '#fff', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px' }}>
                                            Lorem ipsum is simply dummy text of the printing
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-start mb-3">
                                        <div className="chat-avatar me-2" style={{ backgroundColor: '#2B7982', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: '#fff' }}>LN</span>
                                        </div>
                                        <div>
                                            <div className="chat-name" style={{ color: '#fff', fontSize: '14px' }}>Lisa</div>
                                            <div className="chat-message" style={{ backgroundColor: '#1E242B', color: '#B3AEAE', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px', marginTop: '4px' }}>
                                                Lorem ipsum is simply dummy
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end mb-3">
                                        <div className="chat-message" style={{ backgroundColor: '#2A323B', color: '#fff', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px' }}>
                                            Ok, wait, 5 min
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="chat-avatar me-2" style={{ backgroundColor: '#2B7982', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: '#fff' }}>LN</span>
                                        </div>
                                        <div>
                                            <div className="chat-name" style={{ color: '#fff', fontSize: '14px' }}>Lisa</div>
                                            <div className="chat-message" style={{ backgroundColor: '#1E242B', color: '#B3AEAE', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px', marginTop: '4px' }}>
                                                Lorem ipsum is simply dummy
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end mb-3">
                                        <div className="chat-message" style={{ backgroundColor: '#2A323B', color: '#fff', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px' }}>
                                            Ok, wait, 5 min
                                        </div>
                                    </div>
                                </div>

                                <div className="B_search-container  mb-3" >
                                    <div className="position-relative B_input_search B_input_search22  mx-auto">
                                        <input
                                            type="text"
                                            className="form-control text-white ps-3"
                                            placeholder="Write a message..."
                                            style={{ borderRadius: '5px', border: 'none', backgroundColor: "#202F41" }}
                                        />
                                        <IoMdSend className='position-absolute B_sendMsg' />

                                    </div>
                                </div>
                            </div>
                        </>
                    </Offcanvas.Body>
                )}

            </Offcanvas>

        </>
    )
}

export default Screen;