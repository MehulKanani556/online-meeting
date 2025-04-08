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
    const {
        socket,
        isConnected,
        participants,
        setParticipants,
        messages,
        sendMessage,
        emojis,
        sendEmoji,
        unreadMessages,
        markMessagesAsRead,
        toggleChat,
        isChatOpen,
        setIsChatOpen,
        typingUsers,
        emitTypingStatus,
        updateMediaState,
        setupWebRTCHandlers,
        sendOffer,
        sendAnswer,
        sendIceCandidate
    } = useSocket(userId, roomId, userName);



    // WebRTC State
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [showViewMoreDropdown, setShowViewMoreDropdown] = useState(false);
    const [show, setShow] = useState(false);
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [showEmojis, setshowEmojis] = useState(false);
    const [activeEmojis, setActiveEmojis] = useState([]);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});
    const [maxVisibleParticipants, setMaxVisibleParticipants] = useState(9);
    const [billingCycle, setBillingCycle] = useState('Messages');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mainSectionMargin, setMainSectionMargin] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [newName, setNewName] = useState('');
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [lastUnreadIndex, setLastUnreadIndex] = useState(-1);

    // Refs
    const localVideoRef = useRef();
    const peerConnectionsRef = useRef({});
    const messageContainerRef = useRef();
    const videoRefsMap = useRef({});


    const handleClose = () => {
        setShow(false);
        setMainSectionMargin(0);
        setIsChatOpen(false);
    };

    // Modify handleShow to include scroll behavior
    const handleShow = () => {
        setShow(true);
        setIsChatOpen(true);

        // Wait for next tick to ensure DOM is updated
        setTimeout(() => {
            if (messageContainerRef.current) {
                if (unreadMessages > 0) {
                    const firstUnreadIndex = messages.length - unreadMessages;
                    setLastUnreadIndex(firstUnreadIndex);
                    const unreadElement = messageContainerRef.current.children[firstUnreadIndex];
                    if (unreadElement) {
                        unreadElement.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    // If no unread messages, scroll to bottom
                    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
                }
            }
        }, 0);
        markMessagesAsRead();
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (show && windowWidth > 768) {
            setMainSectionMargin(380);
        }
    }, [show, windowWidth]);

    // Add this useEffect for handling auto-scroll and unread messages
    useEffect(() => {
        if (messageContainerRef.current) {
            // If chat is open, scroll to bottom
            if (isChatOpen) {
                messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
            }
            // If chat was closed and now opened, scroll to first unread message
            else if (show && unreadMessages > 0) {
                const firstUnreadIndex = messages.length - unreadMessages;
                setLastUnreadIndex(firstUnreadIndex);
                const unreadElement = messageContainerRef.current.children[firstUnreadIndex];
                if (unreadElement) {
                    unreadElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }, [messages, show, isChatOpen, unreadMessages]);

    // Get current user data
    useEffect(() => {
        dispatch(getUserById(userId));
    }, [userId, dispatch]);

    // Initialize WebRTC
    useEffect(() => {
        async function setupLocalMedia() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                if (stream) {
                    // Store the stream
                    setLocalStream(stream);

                    // Initial state for tracks
                    const audioTrack = stream.getAudioTracks()[0];
                    const videoTrack = stream.getVideoTracks()[0];

                    if (audioTrack) {
                        audioTrack.enabled = !isMuted;
                    }

                    if (videoTrack) {
                        videoTrack.enabled = !isVideoOff;
                    }

                    // Apply to video element with a slight delay to ensure DOM is ready
                    setTimeout(() => {
                        if (localVideoRef.current) {
                            localVideoRef.current.srcObject = stream;
                        }
                    }, 100);
                }
            } catch (error) {
                console.error('Error accessing media devices:', error);
                setIsVideoOff(true);
            }
        }

        setupLocalMedia();

        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Helper function to create peer connection 
    const createPeerConnection = (peerId) => {
        if (peerConnectionsRef.current[peerId]) {
            return peerConnectionsRef.current[peerId];
        }

        console.log(`Creating new peer connection for ${peerId}`);

        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };

        const pc = new RTCPeerConnection(configuration);

        // Add local tracks to the peer connection
        if (localStream) {
            localStream.getTracks().forEach(track => {
                console.log(`Adding ${track.kind} track to peer connection for ${peerId}`);
                pc.addTrack(track, localStream);
            });
        }

        // Handle ICE candidates
        pc.onicecandidate = event => {
            if (event.candidate) {
                console.log(`Sending ICE candidate to ${peerId}`);
                sendIceCandidate(peerId, event.candidate);
            }
        };

        // CRITICAL FIX: Completely revised ontrack handler
        pc.ontrack = event => {
            console.log(`Received ${event.track.kind} track from ${peerId}`, event.streams[0]);

            // Always use the first stream from the event
            if (event.streams && event.streams[0]) {
                const remoteStream = event.streams[0];

                setRemoteStreams(prev => {
                    // Create a new object to ensure React detects the change
                    const newRemoteStreams = { ...prev };
                    newRemoteStreams[peerId] = remoteStream;
                    return newRemoteStreams;
                });

                // Force an update to the video ref
                const videoElement = videoRefsMap.current[peerId];
                if (videoElement) {
                    videoElement.srcObject = remoteStream;
                    videoElement.play().catch(e => console.log('Play error in ontrack:', e));
                }
            }
        };

        // Store the peer connection
        peerConnectionsRef.current[peerId] = pc;
        return pc;
    };

    // Set up WebRTC peer connections when participants change
    useEffect(() => {
        if (!socket || !localStream || !isConnected) return;

        // Set up WebRTC handlers for signaling
        setupWebRTCHandlers({
            handleOffer: async (from, offer) => {
                console.log('Received offer from:', from);

                // Create a new RTCPeerConnection if it doesn't exist
                if (!peerConnectionsRef.current[from]) {
                    createPeerConnection(from);
                }

                const pc = peerConnectionsRef.current[from];

                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    sendAnswer(from, answer);
                } catch (error) {
                    console.error('Error handling offer:', error);
                }
            },

            handleAnswer: async (from, answer) => {
                console.log('Received answer from:', from);

                const pc = peerConnectionsRef.current[from];
                if (pc) {
                    try {
                        // Check if the remote description is already set to avoid errors
                        if (pc.currentRemoteDescription === null) {
                            await pc.setRemoteDescription(new RTCSessionDescription(answer));
                            console.log('Remote description set successfully after answer');
                        }
                    } catch (error) {
                        console.error('Error handling answer:', error);
                    }
                }
            },

            handleIceCandidate: async (from, candidate) => {
                console.log('Received ICE candidate from:', from);

                const pc = peerConnectionsRef.current[from];
                if (pc) {
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (error) {
                        console.error('Error adding ICE candidate:', error);
                    }
                }
            }
        });

        // Initialize connections with a delay to ensure socket is ready
        const initializeConnections = async () => {
            // Filter out ourselves
            const peersToConnect = participants.filter(p => p.id !== socket.id);

            console.log(`Initializing connections with ${peersToConnect.length} peers`);

            for (const peer of peersToConnect) {
                // Skip if a connection already exists
                if (peerConnectionsRef.current[peer.id]) {
                    continue;
                }

                console.log('Creating new connection with:', peer.id);
                const pc = createPeerConnection(peer.id);

                try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    sendOffer(peer.id, offer);
                } catch (error) {
                    console.error('Error creating offer:', error);
                }
            }
        };

        const timer = setTimeout(initializeConnections, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [socket, participants, localStream, isConnected]);

    // This effect ensures remote video elements get updated when streams change
    useEffect(() => {
        Object.entries(remoteStreams).forEach(([peerId, stream]) => {
            const videoElement = videoRefsMap.current[peerId];

            if (videoElement && stream) {
                // Only update if the stream has changed
                if (videoElement.srcObject !== stream) {
                    console.log(`Setting stream for ${peerId} to video element`);

                    // Store the stream first
                    videoElement.srcObject = stream;

                    // Make sure autoplay works even with browser autoplay restrictions
                    videoElement.muted = true; // Temporarily mute to help with autoplay

                    // Use play() with catch to handle autoplay restrictions
                    videoElement.play().catch(err => {
                        console.log(`Error playing video: ${err.message}`);
                        // If autoplay is blocked, we can unmute after user interaction
                        const unmute = () => {
                            videoElement.muted = false;
                            document.removeEventListener('click', unmute);
                        };
                        document.addEventListener('click', unmute);
                    });

                    // Listen for the loadedmetadata event
                    videoElement.onloadedmetadata = () => {
                        console.log(`Video metadata loaded for peer ${peerId}`);
                        videoElement.play().catch(e => console.log('Play failed after metadata:', e));
                    };
                }
            } else {
                console.log(`No video element found for peer ${peerId} or no stream available`);
            }
        });
    }, [remoteStreams]);



    // Force local video connection when ref changes
    useEffect(() => {
        if (localStream && localVideoRef.current) {
            console.log("Setting local video stream to ref");
            // Only update if different
            if (localVideoRef.current.srcObject !== localStream) {
                localVideoRef.current.srcObject = localStream;
            }
        }
    }, [localStream, localVideoRef.current]);


    // Toggle audio
    const toggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
                updateMediaState('audio', audioTrack.enabled);
            }
        } else {
            setIsMuted(!isMuted);
        }
    };

    // Update your toggleVideo function:
    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                const newState = !videoTrack.enabled;
                videoTrack.enabled = newState;
                setIsVideoOff(!newState);

                // Log the state and force stream reconnection
                console.log(`Video toggled. Enabled: ${newState}`);

                // Update all peers about our video state
                updateMediaState('video', newState);
            }
        } else {
            setIsVideoOff(!isVideoOff);
        }
    };

    const setVideoRef = (peerId) => (element) => {
        if (element) {
            // Store the element reference
            videoRefsMap.current[peerId] = element;

            // Get the stream if available
            const stream = remoteStreams[peerId];

            // Apply the stream to the video element if it exists
            if (stream && element.srcObject !== stream) {
                console.log(`Setting stream for ${peerId} in ref callback`);
                element.srcObject = stream;

                // Force play with error handling
                element.play().catch(err => {
                    console.log(`Error playing video in ref callback: ${err.message}`);
                });
            }
        }
    };

    // Share screen
    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true
                });

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

                // Save reference to stop later
                const oldVideoTrack = localStream.getVideoTracks()[0];
                localStream.removeTrack(oldVideoTrack);
                localStream.addTrack(videoTrack);

            } catch (error) {
                console.error('Error sharing screen:', error);
            }
        } else {
            // Stop screen sharing
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const videoTrack = newStream.getVideoTracks()[0];

                // Replace video track in all peer connections
                Object.values(peerConnectionsRef.current).forEach(pc => {
                    const senders = pc.getSenders();
                    const sender = senders.find(s =>
                        s.track && s.track.kind === 'video'
                    );

                    if (sender) {
                        sender.replaceTrack(videoTrack);
                    }
                });

                // Show camera in local video
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = newStream;
                }

                // Update local stream
                const oldVideoTrack = localStream.getVideoTracks()[0];
                if (oldVideoTrack) {
                    oldVideoTrack.stop();
                    localStream.removeTrack(oldVideoTrack);
                }
                localStream.addTrack(videoTrack);

                setIsScreenSharing(false);
                updateMediaState('video', true);
            } catch (error) {
                console.error('Error returning to camera:', error);
            }
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

    // Toggle view more dropdown
    const toggleViewMoreDropdown = () => {
        setShowViewMoreDropdown(!showViewMoreDropdown);
    };

    // End meeting
    const endMeeting = () => {
        // Stop all media tracks
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }

        // Close all peer connections
        Object.values(peerConnectionsRef.current).forEach(pc => {
            pc.close();
        });

        sessionStorage.setItem('openReviewModal', 'true');
        navigate("/home");
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

    // Add hand raise toggle function
    const toggleHandRaise = () => {
        setIsHandRaised(prev => {
            const newState = !prev;
            socket.emit('hand-status-change', {
                roomId,
                hasRaisedHand: newState
            });
            return newState;
        });
    };

    const handleEmojiClick = (emoji) => {
        sendEmoji(emoji);
        setActiveEmojis(prev => [...prev, { emoji, userName, id: Date.now() }]);
    };

    // Add debounce function for typing
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Handle input changes with typing indicator
    const handleMessageInput = (e) => {
        setNewMessage(e.target.value);
        emitTypingStatus(true);

        // Stop typing indicator after 1 second of no input
        debouncedStopTyping();
    };

    const debouncedStopTyping = debounce(() => {
        emitTypingStatus(false);
    }, 2500);

    // Render typing indicator
    const renderTypingIndicator = () => {
        if (typingUsers.length === 0) return null;

        const typingNames = typingUsers
            .filter(user => user.userId !== userId)
            .map(user => user.userName);

        if (typingNames.length === 0) return null;

        const displayText = `${typingNames.join(' & ')} is typing...`;

        return (
            <div className="typing-indicator mb-2 ms-2 d-flex align-items-center" style={{ color: '#BFBFBF', fontSize: '13px' }}>
                <div className="typing-dots me-1">
                    <span className='j_typing_loader'></span>
                    <span className='j_typing_loader'></span>
                    <span className='j_typing_loader'></span>
                </div>
                {displayText}
            </div>
        );
    };

    // Function to toggle participant's microphone
    const toggleMicrophone = (participantId) => {
        if (!socket) return;
        socket.emit('toggle-participant-audio', {
            roomId,
            participantId,
            isMuted: !participants.find(p => p.id === participantId)?.hasAudio
        });
    };

    // Function to make a participant host
    const makeHost = (newHostId) => {
        if (!socket) return;

        socket.emit('make-host', {
            roomId,
            newHostId
        });

        setActiveDropdown(null);
    };

    // Function to make a participant co-host
    const makeCohost = (newCohostId) => {
        if (!socket) return;

        socket.emit('make-cohost', {
            roomId,
            newCohostId
        });

        setActiveDropdown(null);
    };

    // Function to handle participant rename
    const openRenameModal = (participant) => {
        setSelectedParticipant(participant);
        setNewName(participant.name);
        setShowRenameModal(true);
        setActiveDropdown(null);
    };

    const saveNewName = () => {
        if (!socket || !selectedParticipant || !newName.trim()) return;

        socket.emit('rename-participant', {
            roomId,
            participantId: selectedParticipant.id,
            newName: newName.trim()
        });

        setShowRenameModal(false);
        setSelectedParticipant(null);
    };

    // Function to remove a participant
    const removeParticipant = (participantId) => {
        if (!socket) return;

        socket.emit('remove-participant', {
            roomId,
            participantId
        });

        setActiveDropdown(null);
    };

    // Add this function to filter participants
    const filteredParticipants = participants.filter(participant =>
        participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTextareaResize = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(120, e.target.scrollHeight) + 'px';
    };

    return (
        <>
            <section className="d_mainsec" style={{
                marginRight: windowWidth > 768 ? `${mainSectionMargin}px` : 0,
                transition: 'margin-right 0.3s ease-in-out'
            }} >
                <div className="d_topbar"></div>
                <div className="d_mainscreen">
                    <div className={`d_participants-grid ${getGridClass()}`}
                        style={{ gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)` }}>
                        {/* Map all participants including local user */}
                        {visibleParticipants.map((participant, index) => (
                            // console.log("participant", participant),

                            <div key={participant.id} className="d_grid-item">
                                <div className="d_avatar-container">
                                    {participant.id === socket?.id ? (
                                        // Local user video
                                        console.log("local", localVideoRef),
                                        !isVideoOff ? (
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
                                                    textTransform: 'uppercase',
                                                    backgroundColor: `hsl(${participant.id.charCodeAt(0) * 60}, 70%, 45%)`
                                                }}>
                                                {participant.initials}
                                            </div>
                                        )
                                    ) : (
                                        // Remote participant video - fixed version
                                        remoteStreams[participant.id] && participant.hasVideo !== false ? (
                                            <video
                                                ref={setVideoRef(participant.id)}
                                                id={`video-${participant.id}`}
                                                className="d_video-element"
                                                autoPlay
                                                playsInline
                                            />
                                        ) : (
                                            <div className="d_avatar-circle"
                                                style={{
                                                    textTransform: 'uppercase',
                                                    backgroundColor: `hsl(${participant.id.charCodeAt(0) * 60}, 70%, 45%)`
                                                }}>
                                                {participant.initials}
                                            </div>
                                        )
                                    )}
                                    <div className="d_controls-top">
                                        <div className="d_controls-container">
                                            {participant.hasRaisedHand && (
                                                <img
                                                    src={hand}
                                                    className="d_control-icon"
                                                    alt="Hand raised"
                                                    style={{
                                                        animation: 'd_handWave 1s infinite',
                                                        transform: 'translateY(-2px)'
                                                    }}
                                                />
                                            )}
                                            {participant.hasVideo ? (
                                                <img src={oncamera} className="d_control-icon" alt="Camera on" />
                                            ) : (
                                                <img src={offcamera} className="d_control-icon" alt="Camera off" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="d_controls-bottom">
                                        <span className="d_participant-name">
                                            {participant.name}
                                            {participant.isHost ? ' (Host)' : ''}
                                        </span>
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
                <div className="d_bottombar" style={{
                    cursor: "pointer", width: windowWidth > 768 && show ? `calc(100% - ${mainSectionMargin}px)` : '100%',
                    transition: 'width 0.3s ease-in-out'
                }}>
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
                                        <div className="d-flex align-items-center p-2 position-relative" onClick={() => setshowEmojis(!showEmojis)}>
                                            <img src={smile} alt="Emoji" className="me-2" />
                                            <span>Reactions</span>
                                            {showEmojis && (
                                                <div className="emoji-container" style={{ position: 'absolute', width: '250px', bottom: '45px', backgroundColor: '#12161C', border: '1px solid #202f41', padding: '10px', borderRadius: '5px', zIndex: 1000 }}>
                                                    {['❤️', '😃', '😮', '🙌', '😂', '🎉', '👏', '💥', '😉', '🔥', '👍', '👎', '▶️', '✨'].map((emoji, index) => (
                                                        <span
                                                            key={index}
                                                            style={{ cursor: 'pointer', fontSize: '24px', margin: '5px', color: 'white' }}
                                                            onClick={() => handleEmojiClick(emoji)}
                                                        >
                                                            {emoji}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="d-flex align-items-center p-2">
                                            <img src={podcast} alt="" className="me-2" />
                                            <span>Audio Settings</span>
                                        </div>
                                        <div className="d-flex align-items-center p-2"
                                            onClick={toggleHandRaise}
                                            style={{
                                                backgroundColor: isHandRaised ? '#202F41' : 'transparent',
                                                transition: 'background-color 0.3s'
                                            }}>
                                            <img src={hand} alt="" className="me-2" />
                                            <span>Raise Hand</span>
                                        </div>
                                        <div className="d-flex align-items-center p-2" onClick={handleShow}>
                                            <img src={bar} alt="" className="me-2" />
                                            <span>Chat</span>
                                            {unreadMessages > 0 && (
                                                <span className="ms-2 badge rounded-pill" style={{
                                                    padding: "5px",
                                                    width: "25px",
                                                    height: "25px",
                                                    fontSize: "14px",
                                                    background: 'rgb(225, 43, 45)',
                                                }}>
                                                    {unreadMessages}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='d-none d-sm-block'>
                                <div className='d-flex d_resposive'>
                                    <div className="d_box me-sm-3 mb-2 mb-sm-0 position-relative" onClick={() => setshowEmojis(!showEmojis)} style={{
                                        backgroundColor: showEmojis ? '#202F41' : 'transparent',
                                        transition: 'background-color 0.3s'
                                    }}>
                                        <img src={smile} alt="Emoji" />
                                        {showEmojis && (
                                            <div className="emoji-container" style={{ position: 'absolute', width: '250px', bottom: '45px', backgroundColor: '#12161C', border: '1px solid #202f41', padding: '10px', borderRadius: '5px', zIndex: 1000 }}>
                                                {['❤️', '😃', '😮', '🙌', '😂', '🎉', '👏', '💥', '😉', '🔥', '👍', '👎', '▶️', '✨'].map((emoji, index) => (
                                                    <span
                                                        key={index}
                                                        style={{ cursor: 'pointer', fontSize: '24px', margin: '5px', color: 'white' }}
                                                        onClick={() => handleEmojiClick(emoji)}
                                                    >
                                                        {emoji}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
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
                                <div className="d_box me-sm-3 mb-2 mb-sm-0"
                                    onClick={toggleHandRaise}
                                    style={{
                                        backgroundColor: isHandRaised ? '#202F41' : 'transparent',
                                        transition: 'background-color 0.3s'
                                    }}>
                                    <img src={hand} alt="Raise hand" />
                                </div>
                                <div className="d_box position-relative" onClick={handleShow} style={{
                                    backgroundColor: show ? '#202F41' : 'transparent',
                                    transition: 'background-color 0.3s'
                                }}>
                                    <img src={bar} alt="" />
                                    {unreadMessages > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                                            style={{
                                                padding: '3px',
                                                width: '25px',
                                                height: '25px',
                                                border: '2px solid #12161C',
                                                background: '#E12B2D'
                                            }}>
                                            {unreadMessages}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*  Render active emojis with usernames */}
            <div className="active-emojis">
                {emojis.map(({ sender, message, timestamp }, index) => (
                    <div key={index} className="emoji-animation">
                        <span className="emoji">{message}</span>
                        <span className="user-name">{sender}</span>
                    </div>
                ))}
            </div>

            {/* Participants and Chat sidebar (Off-canvas) */}
            <Offcanvas show={show}
                className='B_screen_offcanvas'
                placement='end'
                onHide={handleClose}
                backdrop={windowWidth <= 768}
                style={{
                    width: windowWidth <= 768 ? '400px' : '400px',
                    zIndex: windowWidth <= 768 ? 1050 : 1030
                }}

            >

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
                                Messages ({messages.length})
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
                                Participants ({participants.length})
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
                    <Offcanvas.Body className='B_Ofcanvasbody' >
                        <>
                            <div className='d-flex flex-column h-100 '>
                                <div className="B_search-container  mb-3" >
                                    <div className="position-relative B_input_search B_input_search11  mx-auto">
                                        <IoSearch className=' position-absolute' style={{ top: "50%", transform: "translateY(-50%)", left: "15px", fontSize: "20px", color: "rgba(255, 255, 255, 0.7)" }} />
                                        <input
                                            type="text"
                                            className="form-control text-white j_search_Input ps-5"
                                            placeholder="Search..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ borderRadius: '5px', border: 'none', backgroundColor: "#202F41" }}
                                        />
                                    </div>
                                </div>
                                <div className="list-group B_screen_offcanvas " style={{ height: "82%", overflowY: "auto" }}>
                                    {filteredParticipants.length > 0 ? (
                                        filteredParticipants.map((participant) => (
                                            console.log("participant", participant),
                                            <div key={participant.id} className="list-group-item d-flex align-items-center">
                                                <div className="rounded-circle B_circle d-flex justify-content-center align-items-center me-3"
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        backgroundColor: `hsl(${participant.id.charCodeAt(0) * 60}, 70%, 45%)`,
                                                        color: 'white',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                    {participant.initials}
                                                </div>
                                                <div className="flex-grow-1 B_participateName">
                                                    <div>{participant.name}</div>
                                                </div>

                                                {/* Display Host or Cohost label */}
                                                {(participant.isHost || participant.isCohost) && (
                                                    <div className="me-3">
                                                        <span className="px-3 py-1 rounded-pill text-white"
                                                            style={{
                                                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                                                fontSize: "0.8rem"
                                                            }}>
                                                            {participant.isHost ? "Host" : "Cohost"}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="d-flex align-items-center">
                                                    <div className="d_box me-sm-3 mb-2 mb-sm-0"
                                                        onClick={() => toggleMicrophone(participant.id)}
                                                        style={{ cursor: "pointer" }}>
                                                        <img src={participant.isMicrophoneOn ? onmicrophone : offmicrophone} alt="" />
                                                    </div>

                                                    <div className="position-relative">
                                                        <HiOutlineDotsVertical
                                                            className='mt-1 cursor-pointer B_vertical'
                                                            style={{ cursor: "pointer" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveDropdown(activeDropdown === participant.id ? null : participant.id);
                                                            }}
                                                        />

                                                        {activeDropdown === participant.id && (
                                                            <div
                                                                className="position-absolute end-0 bg-dark text-white rounded shadow py-2"
                                                                style={{
                                                                    zIndex: 1000,
                                                                    width: '150px',
                                                                    top: '100%',
                                                                    right: 0,
                                                                    cursor: "pointer "
                                                                }}
                                                            >
                                                                {!participant.isHost && (
                                                                    <div
                                                                        className="px-3 py-2 hover-bg-secondary cursor-pointer"
                                                                        onClick={() => makeHost(participant.id)}
                                                                    >
                                                                        Make host
                                                                    </div>
                                                                )}
                                                                {!participant.isCohost && !participant.isHost && (
                                                                    <div
                                                                        className="px-3 py-2 hover-bg-secondary cursor-pointer"
                                                                        onClick={() => makeCohost(participant.id)}
                                                                    >
                                                                        Make cohost
                                                                    </div>
                                                                )}
                                                                <div
                                                                    className="px-3 py-2 hover-bg-secondary cursor-pointer"
                                                                    onClick={() => openRenameModal(participant)}>
                                                                    Rename
                                                                </div>

                                                                <div className="px-3 py-2 hover-bg-secondary cursor-pointer"
                                                                    onClick={() => toggleMicrophone(participant.id)}
                                                                >
                                                                    {
                                                                        participant.isMicrophoneOn ? "Mute" : "Unmute"
                                                                    }
                                                                </div>

                                                                <div
                                                                    className="px-3 py-2 hover-bg-secondary cursor-pointer"
                                                                    onClick={() => removeParticipant(participant.id)}
                                                                >
                                                                    Remove
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-white-50 mb-0">
                                                {searchTerm ? 'No users found' : 'No participants in the meeting'}
                                            </p>
                                        </div>
                                    )}

                                    {showRenameModal && (
                                        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1050 }}>
                                            <div className=" text-white rounded" style={{ width: '430px', maxWidth: '90%', backgroundColor: "#12161C" }}>
                                                <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
                                                    <h6 className="m-0 B_EditName" >Edit display name</h6>
                                                    <button
                                                        type="button"
                                                        className="btn-close btn-close-white"
                                                        onClick={() => setShowRenameModal(false)}
                                                        aria-label="Close"
                                                    ></button>
                                                </div>

                                                <div className="p-4 B_screen_Pad">
                                                    <div className="mb-3">
                                                        <label className="form-label small mb-2 text-white-50 mb-2  ">Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control j_search_Input text-white border-0"
                                                            value={newName}
                                                            onChange={(e) => setNewName(e.target.value)}
                                                            style={{ padding: '10px', backgroundColor: "#202F41" }}
                                                        />
                                                    </div>

                                                    <div className="d-flex justify-content-between gap-3 mt-5 B_screen_Margin">
                                                        <button
                                                            className="btn flex-grow-1 py-2"
                                                            onClick={() => setShowRenameModal(false)}
                                                            style={{
                                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                                borderRadius: '4px',
                                                                backgroundColor: 'transparent',
                                                                color: 'white'
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="btn btn-light flex-grow-1 py-2"
                                                            onClick={saveNewName}
                                                            style={{
                                                                borderRadius: '4px',
                                                                backgroundColor: 'white',
                                                                color: 'black'
                                                            }}
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                                <div className="chat-messages flex-grow-1" ref={messageContainerRef} style={{ overflowY: 'auto' }}>
                                    {messages.map((msg, index) => (
                                        <div key={index}
                                            className={`d-flex align-items-start me-2 mb-3 ${index === lastUnreadIndex ? 'first-unread' : ''}`}
                                        >
                                            {msg.sender !== userName && (
                                                <div className="chat-avatar me-2" style={{
                                                    backgroundColor: msg.sender === userName ? '#2B7982' : '#4A90E2',
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    <span style={{ color: '#fff' }}>{msg.sender.charAt(0)}</span>
                                                </div>
                                            )}
                                            <div className="chat-message" style={{ marginLeft: msg.sender === userName ? 'auto' : '0' }}>
                                                <div className="small" style={{ color: msg.sender === userName ? 'white' : '#b3aeae', textAlign: msg.sender === userName ? 'end' : 'start' }}>
                                                    {msg.sender === userName ? 'You' : msg.sender}
                                                </div>
                                                <div style={{
                                                    backgroundColor: msg.sender === userName ? '#2A323B' : '#1E242B',
                                                    color: msg.sender === userName ? 'white' : '#b3aeae',
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    maxWidth: '250px',
                                                    wordBreak: 'break-word',
                                                    whiteSpace: 'pre-wrap'
                                                }}>{msg.message}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {lastUnreadIndex >= 0 && (
                                        <div className="unread-messages-divider">
                                            <span>Unread Messages</span>
                                        </div>
                                    )}
                                </div>

                                {renderTypingIndicator()}

                                <div className="B_search-container  mb-3" >
                                    <div className="position-relative B_input_search B_input_search22  mx-auto">
                                        <form onSubmit={handleSendMessage} className="mt-3 d-flex">
                                            <div className='B_send_msginput j_search_Input'>
                                                <textarea
                                                    type="text"
                                                    className="form-control text-white d_foucscolor B_send_msginput j_search_Input ps-3"
                                                    value={newMessage}
                                                    onChange={(e) => {
                                                        handleMessageInput(e);
                                                        handleTextareaResize(e);
                                                    }}
                                                    onInput={handleTextareaResize}
                                                    onScroll={(e) => {
                                                        e.target.style.paddingRight = '30px';
                                                    }}
                                                    style={{
                                                        paddingRight: '50px',
                                                    }}
                                                    placeholder="Write a message..."
                                                />
                                                <button type="submit" className="position-absolute B_sendMsg">
                                                    <IoMdSend />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </>
                    </Offcanvas.Body>
                )}

            </Offcanvas>
        </>
    );
}

export default Screen;
