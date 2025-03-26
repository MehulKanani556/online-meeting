import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:5000"; // Move to environment variable in production

export const useSocket = (userId, roomId, userName) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [emojis, setemojis] = useState([]);
    const peerConnectionsRef = useRef({});

    // console.log("participants----------", participants);

    // Initialize socket connection
    useEffect(() => {
        if (!userId || !roomId) return;

        // Clear any existing connection
        if (socketRef.current && isConnected) {
            socketRef.current.disconnect();
        }

        socketRef.current = io(SOCKET_SERVER_URL);

        socketRef.current.on("connect", () => {
            setIsConnected(true);
            // Join room
            socketRef.current.emit('join-room', {
                roomId,
                userId,
                userName
            });
        });

        // Handle new user connected
        socketRef.current.on('user-connected', (user) => {
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
        });

        // Get list of room users when joining
        socketRef.current.on('room-users', (roomUsers) => {
            console.log('Current room users:', roomUsers);
            const formattedParticipants = roomUsers.map(user => ({
                id: user.id,
                initials: `${user.userName.charAt(0)}${user.userName.split(' ')[1] ? user.userName.split(' ')[1].charAt(0) : ''}`,
                userId: user.userId,
                name: user.userName,
                hasVideo: false,
                hasAudio: false,
                isHost: user.isHost
            }));

            // console.log("formattedParticipants", formattedParticipants);

            setParticipants(formattedParticipants);
        });

        // Handle user disconnection
        socketRef.current.on('user-disconnected', (socketId) => {
            // console.log('User disconnected:', socketId);
            setParticipants(prev =>
                prev.filter(participant => participant.id !== socketId)
            );
        });

        // Handle chat messages
        socketRef.current.on('receive-message', (message) => {
            setMessages(prev => [...prev, message]);

        });

        // Handle received emojis
        socketRef.current.on('receive-emoji', (data) => {
            setemojis(prev => [...prev, {
                sender: data.sender,
                message: data.emoji,
                timestamp: data.timestamp
            }]);
        });

        // Handle audio status changes
        socketRef.current.on('audio-status-updated', ({ userId, hasAudio }) => {
            setParticipants(prev => prev.map(participant =>
                participant.id === userId
                    ? { ...participant, hasAudio }
                    : participant
            ));
        });

        // Handle video status changes
        socketRef.current.on('video-status-updated', ({ userId, hasVideo }) => {
            setParticipants(prev => prev.map(participant =>
                participant.id === userId
                    ? { ...participant, hasVideo }
                    : participant
            ));
        });

        // Handle hand raise status changes
        socketRef.current.on('hand-status-updated', ({ userId, hasRaisedHand }) => {
            setParticipants(prev => prev.map(participant =>
                participant.id === userId
                    ? { ...participant, hasRaisedHand }
                    : participant
            ));
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [userId, roomId, userName]);

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

    // WebRTC signaling handlers
    const setupWebRTCHandlers = (callbacks) => {
        if (!socketRef.current) return;

        socketRef.current.on('offer', async ({ from, offer }) => {
            if (callbacks.handleOffer) {
                await callbacks.handleOffer(from, offer);
            }
        });

        socketRef.current.on('answer', async ({ from, answer }) => {
            if (callbacks.handleAnswer) {
                await callbacks.handleAnswer(from, answer);
            }
        });

        socketRef.current.on('ice-candidate', async ({ from, candidate }) => {
            if (callbacks.handleIceCandidate) {
                await callbacks.handleIceCandidate(from, candidate);
            }
        });
    };

    // WebRTC signaling emitters
    const sendOffer = (to, offer) => {
        if (socketRef.current) {
            socketRef.current.emit('offer', {
                to,
                from: socketRef.current.id,
                offer
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

    const sendAnswer = (to, answer) => {
        if (socketRef.current) {
            socketRef.current.emit('answer', {
                to,
                from: socketRef.current.id,
                answer
            });
        }
    };

    const sendIceCandidate = (to, candidate) => {
        if (socketRef.current) {
            socketRef.current.emit('ice-candidate', {
                to,
                candidate
            });
        }
    };

    // Add this function to create a peer connection
    const createPeerConnection = (userId) => {
        const peerConnection = new RTCPeerConnection(); // Create a new RTCPeerConnection

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('ice-candidate', {
                    to: userId,
                    candidate: event.candidate
                });
            }
        };

        // Handle remote stream
        peerConnection.ontrack = (event) => {
            // Add logic to display the remote stream
        };

        peerConnectionsRef.current[userId] = peerConnection; // Store the peer connection
    };

    // Add this function to handle the offer
    const handleOffer = async (from, offer) => {
        const peerConnection = createPeerConnection(from);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socketRef.current.emit('answer', { to: from, answer });
    };

    // Add this function to handle the answer
    const handleAnswer = async (from, answer) => {
        const peerConnection = peerConnectionsRef.current[from];
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    };

    // Add this function to handle ICE candidates
    const handleIceCandidate = async (from, candidate) => {
        const peerConnection = peerConnectionsRef.current[from];
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    // Call setupWebRTCHandlers to initialize signaling
    useEffect(() => {
        setupWebRTCHandlers({
            handleOffer,
            handleAnswer,
            handleIceCandidate
        });
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
        participants,
        messages,
        sendMessage,
        setParticipants,
        setupWebRTCHandlers,
        sendOffer,
        sendAnswer,
        sendIceCandidate,
        sendEmoji,
        emojis,
    };
}
