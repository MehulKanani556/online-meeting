import React, { useState } from 'react'
import './../CSS/darshan.css'
import onmicrophone from '../Image/d_onmicrophone.svg'
import offmicrophone from '../Image/d_offmicrophone.svg'
import oncamera from '../Image/d_oncamera.svg'
import offcamera from '../Image/d_offcamera.svg'
import upload from '../Image/d_upload.svg'
import target from '../Image/d_target.svg'
import smile from '../Image/d_smile.svg'
import podcast from '../Image/d_podcast.svg'
import hand from '../Image/d_hand.svg'
import bar from '../Image/d_bar.svg'

function Screen() {



    const [isMicrophoneOn, setMicrophoneOn] = useState(false);
    const [isCameraOn, setCameraOn] = useState(false);
    const [showAllParticipants, setShowAllParticipants] = useState(false);

    const toggleMicrophone = () => {
        setMicrophoneOn(!isMicrophoneOn);
    };
    const toggleCamera = () => {
        setCameraOn(!isCameraOn);
    };

    const toggleParticipantsList = () => {
        setShowAllParticipants(!showAllParticipants);
    };

    const [participants, setParticipants] = useState([
        { id: 1, name: 'Johan Kumar', initials: 'JK', hasVideo: false, hasAudio: true },
        { id: 2, name: 'Lisa Nihar', initials: 'LN', hasVideo: false, hasAudio: false },
        { id: 3, name: 'Kiara Patel', initials: 'KP', hasVideo: false, hasAudio: true },
        { id: 4, name: 'Liza Patel', initials: 'LP', hasVideo: false, hasAudio: true },
        { id: 4, name: 'Liza Patel', initials: 'LP', hasVideo: false, hasAudio: true },
        { id: 4, name: 'Liza Patel', initials: 'LP', hasVideo: false, hasAudio: true },
        { id: 4, name: 'Liza Patel', initials: 'LP', hasVideo: false, hasAudio: true },
        { id: 4, name: 'Liza Patel', initials: 'LP', hasVideo: false, hasAudio: true },
        { id: 4, name: 'Liza Patel', initials: 'LP', hasVideo: false, hasAudio: true },
        { id: 4, name: 'Liza Patel', initials: 'LP', hasVideo: true, hasAudio: true },
        // You can add more participants as needed
    ]);

    // Function to handle responsive grid sizing
    const getGridColClass = (count) => {
        if (count === 1) return "col-12";
        if (count === 2) return "col-md-6";
        if (count <= 4) return "col-md-6 col-lg-6";
        if (count <= 9) return "col-md-6 col-lg-4";
        return "col-md-6 col-lg-4";
    };

    // Calculate visible participants and extras
    const maxVisibleParticipants = 9;
    const visibleParticipants = participants.slice(0, maxVisibleParticipants);
    const extraParticipants = participants.length > maxVisibleParticipants ?
        participants.length - (maxVisibleParticipants - 1) : 0;

    return (
        <>

            <section className="d_mainsec d-flex flex-column">
                <div className="d_topbar"></div>
                <div className="d_mainscreen">
                    <div className="container-fluid bg-dark p-2">
                        <div className="row g-2">
                            {visibleParticipants.map((participant, index) => (
                                <div key={participant.id} className={getGridColClass(participants.length)}>
                                    <div className="position-relative bg-black rounded" style={{ aspectRatio: "16/9" }}>
                                        {participant.hasVideo ? (
                                            // Video participant
                                            <div className="w-100 h-100">
                                                <img

                                                    alt={participant.name}
                                                    className="w-100 h-100 object-fit-cover rounded"
                                                />
                                                <div className="position-absolute bottom-0 start-0 p-2 d-flex align-items-center">
                                                    <span className="text-white">{participant.name}</span>
                                                    <div className="ms-2">
                                                        {participant.hasAudio ? (
                                                            <i className="bi bi-mic-fill text-white"></i>
                                                        ) : (
                                                            <i className="bi bi-mic-mute-fill text-white"></i>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // Avatar participant
                                            <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
                                                <div
                                                    className="rounded-circle d-flex justify-content-center align-items-center text-white fs-1"
                                                    style={{
                                                        width: "100px",
                                                        height: "100px",
                                                        backgroundColor: `hsl(${participant.id * 60}, 70%, 45%)`
                                                    }}
                                                >
                                                    {participant.initials}
                                                </div>
                                                <div className="position-absolute bottom-0 w-100 d-flex justify-content-between p-2">
                                                    <span className="text-white">{participant.name}</span>
                                                    <div className="d-flex">
                                                        {participant.hasAudio ? (
                                                            <i className="bi bi-mic-fill text-white mx-1"></i>
                                                        ) : (
                                                            <i className="bi bi-mic-mute-fill text-white mx-1"></i>
                                                        )}
                                                        <i className="bi bi-camera-video-off-fill text-white mx-1"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        )}


                                        {/* Show overlay for the last visible participant if there are extra participants */}
                                        {index === maxVisibleParticipants - 1 && extraParticipants > 0 && (
                                            <div onClick={toggleParticipantsList} className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-75 d-flex justify-content-center align-items-center rounded">
                                                <span className="text-white fs-4">+{extraParticipants} others</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="d_bottombar mt-auto" style={{ cursor: "pointer" }}>
                    <div className="d-flex justify-content-between align-items-center">

                        {/* 1st div */}
                        <div className="d-flex align-items-center d_resposive ">
                            <div className="d_box me-sm-3 mb-2 mb-sm-0" onClick={toggleMicrophone}>
                                <img src={isMicrophoneOn ? onmicrophone : offmicrophone} alt="" />
                            </div>
                            <div className="d_box" onClick={toggleCamera}>
                                <img src={isCameraOn ? oncamera : offcamera} alt="" />
                            </div>
                        </div>

                        {/* New Div */}
                        <div className="d-flex align-items-center">
                            <div className='d-flex d_resposive d_marginright'>
                                <div className="d_box me-sm-3 mb-2 mb-sm-0">
                                    <img src={upload} alt="" />
                                </div>
                                <div className="d_box me-sm-3">
                                    <img src={target} alt="" />
                                </div>
                            </div>
                            <div className="d_box me-sm-3 mx-3 mx-sm-0 d_red" style={{ cursor: "pointer" }} >
                                <p className="mb-0">End Meeting</p>
                            </div>
                            <div className='d-flex d_resposive d_marginleft'>
                                <div className="d_box me-sm-3 mb-2 mb-sm-0">
                                    <img src={smile} alt="" />
                                </div>
                                <div className="d_box me-sm-3">
                                    <img src={podcast} alt="" />
                                </div>
                            </div>
                        </div>
                        {/* 3rd div */}
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
            </section>

            {/* Add the modal/popup for all participants */}
            {showAllParticipants && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
                    <div className="bg-white rounded p-4" style={{ maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">People</h5>
                            <button className="btn-close" onClick={toggleParticipantsList}></button>
                        </div>
                        <div className="list-group">
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
                                    <div className="d-flex">
                                        {participant.hasAudio ? (
                                            <i className="bi bi-mic-fill mx-2"></i>
                                        ) : (
                                            <i className="bi bi-mic-mute-fill mx-2"></i>
                                        )}
                                        {participant.hasVideo ? (
                                            <i className="bi bi-camera-video-fill mx-2"></i>
                                        ) : (
                                            <i className="bi bi-camera-video-off-fill mx-2"></i>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}


        </>
    )
}

export default Screen;
