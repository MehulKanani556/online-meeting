import React, { useEffect, useRef, useState } from 'react';
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
import { getUserById } from '../Redux/Slice/user.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useSocket } from '../Hooks/useSocket';

function Screen() {
    const { id: roomId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Current user information
    const userId = sessionStorage.getItem('userId');
    const currUser = useSelector((state) => state.user.currUser);
    const userInitials = currUser?.name ? `${currUser.name.charAt(0)}${currUser.name.split(' ')[1] ? currUser.name.split(' ')[1].charAt(0) : ''}` : 'U';
    const userName = currUser?.name || 'User';

    // Use the socket hook
    const { socket, isConnected, participants, messages, sendMessage } = useSocket(userId, roomId, userName);
    // console.log("participants", participants.length);


    // WebRTC State
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [showAllParticipants, setShowAllParticipants] = useState(false);
    const [showViewMoreDropdown, setShowViewMoreDropdown] = useState(false);
    const [show, setShow] = useState(false);

    // Refs
    const socketRef = useRef();
    const localStreamRef = useRef();
    const screenStreamRef = useRef();
    const localVideoRef = useRef();
    const peerConnectionsRef = useRef({});
    const messageContainerRef = useRef();

    // Off-canvas handlers
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Get current user data
    useEffect(() => {
        dispatch(getUserById(userId));
    }, [userId, dispatch]);


    // Toggle audio
    const toggleAudio = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        } else {
            setIsMuted(!isMuted);
        }
    };

    // Toggle video
    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
        else {
            setIsVideoOff(!isVideoOff);
        }
    };

    // Share screen
    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true
                });

                screenStreamRef.current = screenStream;

                // Replace video track in all peer connections
                const videoTrack = screenStream.getVideoTracks()[0];

                Object.values(peerConnectionsRef.current).forEach(pc => {
                    const senders = pc.getSenders();
                    const sender = senders.find(s =>
                        s.track && s.track.kind === 'video'
                    );

                    if (sender) {
                        sender.replaceTrack(videoTrack);
                    }
                });

                // Show screen share in local video
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = screenStream;
                }

                // Listen for end of screen sharing
                videoTrack.onended = () => {
                    toggleScreenShare();
                };

                setIsScreenSharing(true);
            } catch (error) {
                console.error('Error sharing screen:', error);
            }
        } else {
            // Stop screen sharing
            if (screenStreamRef.current) {
                screenStreamRef.current.getTracks().forEach(track => track.stop());
                screenStreamRef.current = null;
            }

            // Revert to camera
            const videoTrack = localStreamRef.current.getVideoTracks()[0];

            Object.values(peerConnectionsRef.current).forEach(pc => {
                const senders = pc.getSenders();
                const sender = senders.find(s =>
                    s.track && s.track.kind === 'video'
                );

                if (sender && videoTrack) {
                    sender.replaceTrack(videoTrack);
                }
            });

            // Show camera in local video
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStreamRef.current;
            }

            setIsScreenSharing(false);
        }
    };

    // Update the sendMessage handler
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMessage(newMessage);
            setNewMessage('');
        }
    };

    // Toggle participants list
    const toggleParticipantsList = () => {
        setShowAllParticipants(!showAllParticipants);
    };

    // Toggle view more dropdown
    const toggleViewMoreDropdown = () => {
        setShowViewMoreDropdown(!showViewMoreDropdown);
    };

    // End meeting
    const endMeeting = () => {
        navigate('/home');
    };

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

    // Set max visible participants based on screen size
    const [maxVisibleParticipants, setMaxVisibleParticipants] = useState(9);

    useEffect(() => {
        const handleResize = () => {
            setMaxVisibleParticipants(window.innerWidth <= 425 ? 6 : 9);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get visible participants
    const visibleParticipants = participants.slice(0, maxVisibleParticipants);
    const extraParticipants = participants.length > maxVisibleParticipants ?
        participants.length - (maxVisibleParticipants - 1) : 0;
    // console.log("visibleParticipants", visibleParticipants)


    // Handle clickoutside for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showViewMoreDropdown && !event.target.closest('.d_dropdown') && !event.target.closest('.d_box1')) {
                setShowViewMoreDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showViewMoreDropdown]);

    return (
        <>
            <section className="d_mainsec">
                <div className="d_topbar"></div>
                <div className="d_mainscreen">
                    <div className={`d_participants-grid ${getGridClass()}`}
                        style={{ gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)` }}>
                        {/* Map all participants including local user */}
                        {visibleParticipants.map((participant, index) => (
                            // console.log("participant", participant),

                            <div key={participant.id} className="d_grid-item">
                                <div className="d_avatar-container">
                                    {participant.id === socketRef.current?.id ? (
                                        // Local user video
                                        isVideoOff ? (
                                            <video
                                                ref={localVideoRef}
                                                className="d_video-element"
                                                autoPlay
                                                muted
                                                playsInline
                                            />
                                        ) : (
                                            <div className="d_avatar-circle"
                                                style={{
                                                    textTransform: 'capitalize',
                                                    backgroundColor: `hsl(60, 70%, 45%)`
                                                }}>
                                                {userInitials}
                                            </div>
                                        )
                                    ) : (
                                        // Remote participant video
                                        participant.hasVideo ? (
                                            <video
                                                id={`video-${participant.id}`}
                                                className="d_video-element"
                                                autoPlay
                                                playsInline
                                            />
                                        ) : (
                                            <div className="d_avatar-circle"
                                                style={{
                                                    textTransform: 'capitalize',
                                                    backgroundColor: `hsl(${participant.id.charCodeAt(0) * 60}, 70%, 45%)`
                                                }}>
                                                {participant.initials}
                                            </div>
                                        )
                                    )}
                                    <div className="d_controls-top">
                                        <div className="d_controls-container">
                                            <img src={hand} className="d_control-icon" alt="Raise hand" />
                                            {isVideoOff ? (
                                                <img src={offcamera} className="d_control-icon" alt="Camera on" />
                                            ) : (
                                                <img src={oncamera} className="d_control-icon" alt="Camera off" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="d_controls-bottom">
                                        <span className="d_participant-name">
                                            {participant.name}
                                            {participant.isHost ? ' (Host)' : ''}
                                        </span>
                                        <div className="d_mic-status">
                                            {isMuted ? (
                                                <img src={offmicrophone} className="d_control-icon" alt="Microphone on" />
                                            ) : (
                                                <img src={onmicrophone} className="d_control-icon" alt="Microphone off" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Display extra participants indicator */}
                                {index === maxVisibleParticipants - 2 && extraParticipants > 0 && (
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
                                <div className="d_box me-sm-3 mb-2 mb-sm-0" onClick={toggleAudio}>
                                    <img src={isMuted ? offmicrophone : onmicrophone} alt="" />
                                </div>
                                <div className="d_box" onClick={toggleVideo}>
                                    <img src={isVideoOff ? offcamera : oncamera} alt="" />
                                </div>
                            </div>
                        </div>

                        {/* New Div */}
                        <div className="d-flex align-items-center">
                            <div className='d-none d-sm-block'>
                                <div className='d-flex d_resposive'>
                                    <div className="d_box me-sm-3 mb-2 mb-sm-0" onClick={toggleScreenShare}>
                                        <img src={upload} alt="" />
                                    </div>
                                    <div className="d_box me-sm-3">
                                        <img src={target} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="d_box1 me-sm-3 mx-3 mx-sm-0 d_red" style={{ cursor: "pointer" }} onClick={endMeeting}>
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
                                        <div className="d-flex align-items-center p-2" onClick={toggleAudio}>
                                            <img src={isMuted ? offmicrophone : onmicrophone} className="me-2" alt="" />
                                            <span>Microphone</span>
                                        </div>
                                        <div className="d-flex align-items-center p-2" onClick={toggleVideo}>
                                            <img src={isVideoOff ? offcamera : oncamera} className="me-2" alt="" />
                                            <span>Camera</span>
                                        </div>
                                        <div className="d-flex align-items-center p-2" onClick={toggleScreenShare}>
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
                                    <img src={bar} alt="" onClick={handleShow} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Participants and Chat sidebar (Off-canvas) */}
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Meeting Info</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="p-2">
                        <h5>Meeting ID: {roomId}</h5>
                        <hr />
                        <h5>Participants ({participants.length})</h5>
                        <ul className="list-unstyled">
                            {participants.map(participant => (
                                <li key={participant.id} className="my-2 d-flex align-items-center justify-content-between">
                                    <div>
                                        <span>{participant.name}</span>
                                        {participant.isHost && participant.userId && <span className="ms-2 badge bg-primary">Host</span>}
                                        {participant.id === socketRef.current?.id && <span className="ms-2">(You)</span>}
                                    </div>
                                    <div>
                                        {participant.hasAudio ?
                                            <img src={onmicrophone} className="d_control-icon me-2" alt="Mic on" width="20" /> :
                                            <img src={offmicrophone} className="d_control-icon me-2" alt="Mic off" width="20" />
                                        }
                                        {participant.hasVideo ?
                                            <img src={oncamera} className="d_control-icon" alt="Cam on" width="20" /> :
                                            <img src={offcamera} className="d_control-icon" alt="Cam off" width="20" />
                                        }
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <hr />
                        <h5>Chat</h5>
                        <div
                            ref={messageContainerRef}
                            className="chat-messages p-2"
                            style={{ height: "200px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "8px" }}
                        >
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`p-2 mb-2 rounded ${msg.sender === userName ? 'bg-primary text-white ms-auto' : 'bg-light'}`}
                                    style={{ maxWidth: "80%" }}
                                >
                                    <div className="small fw-bold">{msg.sender}</div>
                                    <div>{msg.message}</div>
                                    <div className="small text-end">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="mt-3 d-flex">
                            <input
                                type="text"
                                className="form-control"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                            />
                            <button type="submit" className="btn btn-primary ms-2">
                                <IoMdSend />
                            </button>
                        </form>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default Screen;
