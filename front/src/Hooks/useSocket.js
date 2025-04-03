import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:5000"; // Move to environment variable in production

export const useSocket = (userId, roomId, userName) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [emojis, setemojis] = useState([]);
    const [streams, setStreams] = useState({});
    const peerConnectionsRef = useRef({});
    const [remoteStreams, setRemoteStreams] = useState({});
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);

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
            // console.log('Video status updated:', userId, hasVideo);
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

        // Handle audio toggle
        socketRef.current.on('audio-status-updated', ({ participantId, hasAudio }) => {
            setParticipants(prev => prev.map(participant =>
                participant.id === participantId
                    ? { ...participant, hasAudio }
                    : participant
            ));
        });

        // Listen for typing status
        socketRef.current.on('typing-status', ({ users }) => {
            setTypingUsers(users);
        });

        return () => {
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

    const startStreaming = (stream) => {
        if (!socketRef.current) return;

        // Add local stream to all peer connections
        Object.entries(peerConnectionsRef.current).forEach(([userId, pc]) => {
            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream);
            });
        });

        // Notify other users about video status
        socketRef.current.emit('video-status-change', {
            roomId,
            hasVideo: true
        });
    };

    // Add the handleRemoteStream function before createPeerConnection
    const handleRemoteStream = (stream, userId) => {
        setRemoteStreams(prev => ({
            ...prev,
            [userId]: stream
        }));

        // Update participant video status
        setParticipants(prev => prev.map(participant =>
            participant.id === userId
                ? { ...participant, hasVideo: true }
                : participant
        ));
    };

    // Modify the peerConnection.ontrack event handler
    const createPeerConnection = (userId) => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('ice-candidate', {
                    to: userId,
                    candidate: event.candidate
                });
            }
        };

        // Handle remote stream with correct userId
        peerConnection.ontrack = (event) => {
            const remoteStream = event.streams[0];
            handleRemoteStream(remoteStream, userId);
        };

        peerConnectionsRef.current[userId] = peerConnection;
        return peerConnection;
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
        streams,
        startStreaming,
        remoteStreams,
        unreadMessages,
        markMessagesAsRead,
        toggleChat,
        isChatOpen,
        setIsChatOpen,
        typingUsers,
        emitTypingStatus,
    };
}