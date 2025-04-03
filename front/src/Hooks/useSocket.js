import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:5000"; // Move to environment variable in production

export const useSocket = (userId, roomId, userName) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [emojis, setemojis] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);


    const localStreamRef = useRef();
    const screenStreamRef = useRef();
    const localVideoRef = useRef();
    const peerConnectionsRef = useRef({});

    // Initialize socket connection
    useEffect(() => {
        if (!userId || !roomId) return;

        // Clear any existing connection
        if (socketRef.current && isConnected) {
            socketRef.current.disconnect();
        }

        socketRef.current = io(SOCKET_SERVER_URL);

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
            .then(stream => {
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Join room
                // socketRef.current.on("connect", () => {
                //     setIsConnected(true);
                //     // Join room
                //     socketRef.current.emit('join-room', {
                //         roomId,
                //         userId,
                //         userName
                //     });
                // });

                socketRef.current.emit('join-room', {
                    roomId,
                    userId,
                    userName
                });

                // Handle new user connected
                // socketRef.current.on('user-connected', (user) => {
                //     // console.log('New user connected:', user);
                //     setParticipants(prev => [
                //         ...prev,
                //         {
                //             id: user.socketId,
                //             userId: user.userId,
                //             name: user.userName,
                //             hasVideo: false,
                //             hasAudio: false,
                //             initials: `${user.userName.charAt(0)}${user.userName.split(' ')[1] ? user.userName.split(' ')[1].charAt(0) : ''}`,
                //             isHost: user.isHost
                //         }
                //     ]);
                // });

                // Handle new user connected
                socketRef.current.on('user-connected', async (user) => {
                    // console.log('New user connected:', user);
                    setParticipants(prev => [
                        ...prev,
                        {
                            id: user.socketId,
                            userId: user.userId,
                            name: user.userName,
                            hasVideo: false,
                            hasAudio: false,
                            initials: `${user.userName.charAt(0)}${user.userName.split(' ')[1] ? user.userName.split(' ')[1].charAt(0) : ''}`,
                            isHost: user.isHost
                        }
                    ]);
                    // Create new peer connection for this user
                    await createPeerConnection(user.socketId, true);
                });

                // Get list of room users when joining
                // socketRef.current.on('room-users', (roomUsers) => {
                //     // console.log('Current room users:', roomUsers);
                //     setParticipants(roomUsers);

                //     // Create peer connections with existing users
                //     roomUsers.forEach(async (user) => {
                //         if (user.id !== socketRef.current.id) {
                //             await createPeerConnection(user.id, false);
                //         }
                //     });
                // });

                // Get list of room users when joining
                socketRef.current.on('room-users', (roomUsers) => {
                    // console.log('Current room users:', roomUsers);
                    const formattedParticipants = roomUsers.map(user => ({
                        id: user.id,
                        initials: `${user.userName.charAt(0)}${user.userName.split(' ')[1] ? user.userName.split(' ')[1].charAt(0) : ''}`,
                        userId: user.userId,
                        name: user.userName,
                        hasVideo: false,
                        hasAudio: false,
                        isHost: user.isHost
                    }));
                    setParticipants(formattedParticipants);

                    roomUsers.forEach(async (user) => {
                        if (user.id !== socketRef.current.id) {
                            await createPeerConnection(user.id, false);
                        }
                    });
                });

                // Handle WebRTC signaling
                socketRef.current.on('offer', async ({ from, offer }) => {
                    // console.log('Received offer from:', from);
                    const peerConnection = peerConnectionsRef.current[from] ||
                        await createPeerConnection(from, false);

                    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);

                    socketRef.current.emit('answer', {
                        to: from,
                        from: socketRef.current.id,
                        answer
                    });
                });

                socketRef.current.on('answer', async ({ from, answer }) => {
                    // console.log('Received answer from:', from);
                    const peerConnection = peerConnectionsRef.current[from];

                    if (peerConnection) {
                        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
                    }
                });

                socketRef.current.on('ice-candidate', async ({ from, candidate }) => {
                    // console.log('Received ICE candidate from:', from);
                    const peerConnection = peerConnectionsRef.current[from];

                    if (peerConnection) {
                        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                });

                // Handle user disconnection
                socketRef.current.on('user-disconnected', (socketId) => {
                    // console.log('User disconnected:', socketId);
                    // Remove peer connection
                    if (peerConnectionsRef.current[socketId]) {
                        peerConnectionsRef.current[socketId].close();
                        delete peerConnectionsRef.current[socketId];
                    }

                    // Remove from participants
                    setParticipants(prev =>
                        prev.filter(participant => participant.id !== socketId)
                    );

                    // Remove video element
                    const videoElement = document.getElementById(`video-${socketId}`);
                    if (videoElement) {
                        videoElement.remove();
                    }
                });

                // Handle chat messages
                socketRef.current.on('receive-message', (message) => {
                    setMessages(prev => [...prev, message]);
                    if (!isChatOpen && message.sender !== userName) {
                        setUnreadMessages(prev => prev + 1);
                    }
                });

                // Handle received emojis
                socketRef.current.on('receive-emoji', (data) => {
                    setemojis(prev => [...prev, {
                        sender: data.sender,
                        message: data.emoji,
                        timestamp: data.timestamp
                    }]);
                });

                // Handle hand raise status changes
                socketRef.current.on('hand-status-updated', ({ userId, hasRaisedHand }) => {
                    setParticipants(prev => prev.map(participant =>
                        participant.id === userId
                            ? { ...participant, hasRaisedHand }
                            : participant
                    ));
                });

                // Handle host changes
                socketRef.current.on('host-updated', ({ newHostId }) => {
                    setParticipants(prev => prev.map(participant => ({
                        ...participant,
                        isHost: participant.id === newHostId,
                        isCohost: participant.id === newHostId ? false : participant.isCohost
                    })));
                });

                // Handle co-host changes
                socketRef.current.on('cohost-updated', ({ newCohostId }) => {
                    setParticipants(prev => prev.map(participant => ({
                        ...participant,
                        isCohost: participant.id === newCohostId
                    })));
                });

                // Handle participant rename
                socketRef.current.on('participant-renamed', ({ participantId, newName }) => {
                    setParticipants(prev => prev.map(participant =>
                        participant.id === participantId
                            ? {
                                ...participant,
                                name: newName,
                                initials: `${newName.charAt(0)}${newName.split(' ')[1] ? newName.split(' ')[1].charAt(0) : ''}`
                            }
                            : participant
                    ));
                });

                // Handle participant removal
                socketRef.current.on('participant-removed', ({ participantId }) => {
                    setParticipants(prev => prev.filter(participant => participant.id !== participantId));
                });

                // Listen for typing status
                socketRef.current.on('typing-status', ({ users }) => {
                    setTypingUsers(users);
                });

            })
            .catch(error => {
                console.error('Error accessing media devices:', error);
                alert('Failed to access camera and microphone. Please check permissions.');
            });

        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }

            if (screenStreamRef.current) {
                screenStreamRef.current.getTracks().forEach(track => track.stop());
            }

            // Close all peer connections
            Object.values(peerConnectionsRef.current).forEach(connection => {
                connection.close();
            });

            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            if (socketRef.current) {
                socketRef.current.off('typing-status');
            }
        };
    }, [userId, roomId, userName, isChatOpen]);

    // Helper function to send a message
    const sendMessage = (message) => {
        if (socketRef.current && message.trim()) {
            socketRef.current.emit('send-message', {
                roomId,
                message,
                sender: userName
            });
        }
    };

    // Helper function to send an emoji
    const sendEmoji = (emoji) => {
        if (socketRef.current && emoji.trim()) {
            socketRef.current.emit('send-emoji', {
                roomId,
                emoji,
                sender: userName
            });
        }
    };

    // Create peer connection function
    const createPeerConnection = async (remotePeerId, isInitiator) => {
        // console.log('Creating peer connection with:', remotePeerId, 'isInitiator:', isInitiator);

        // Use existing connection if available
        if (peerConnectionsRef.current[remotePeerId]) {
            return peerConnectionsRef.current[remotePeerId];
        }

        // ICE servers (STUN/TURN)
        const iceServers = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };

        // Create new RTCPeerConnection
        const peerConnection = new RTCPeerConnection(iceServers);
        peerConnectionsRef.current[remotePeerId] = peerConnection;

        // Add local stream tracks to peer connection
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStreamRef.current);
            });
        }

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('ice-candidate', {
                    to: remotePeerId,
                    candidate: event.candidate
                });
            }
        };

        // Handle incoming streams
        peerConnection.ontrack = (event) => {

            // Create video element for remote stream if it doesn't exist
            let videoElement = document.getElementById(`video-${remotePeerId}`);

            if (!videoElement) {
                videoElement = document.createElement('video');
                videoElement.id = `video-${remotePeerId}`;
                videoElement.autoplay = true;
                videoElement.playsInline = true;
                document.getElementById('videos-container').appendChild(videoElement);
            }

            videoElement.srcObject = event.streams[0];
        };

        // If initiator, create and send offer
        if (isInitiator) {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            socketRef.current.emit('offer', {
                to: remotePeerId,
                from: socketRef.current.id,
                offer
            });
        }

        return peerConnection;
    };

    // Add function to mark messages as read
    const markMessagesAsRead = () => {
        setUnreadMessages(0);
    };

    // Add function to toggle chat
    const toggleChat = () => {
        setIsChatOpen(prev => !prev);
        if (!isChatOpen) {
            markMessagesAsRead();
        }
    };

    // Add function to emit typing status
    const emitTypingStatus = (isTyping) => {
        if (!socketRef.current) return;

        socketRef.current.emit('user-typing', {
            roomId,
            userId,
            userName,
            isTyping
        });
    };

    return {
        socket: socketRef.current,
        localStreamRef,
        isConnected,
        localVideoRef,
        participants,
        messages,
        sendMessage,
        setParticipants,
        screenStreamRef,
        sendEmoji,
        emojis,
        unreadMessages,
        markMessagesAsRead,
        toggleChat,
        isChatOpen,
        setIsChatOpen,
        typingUsers,
        emitTypingStatus,
        peerConnectionsRef,
    };
}
