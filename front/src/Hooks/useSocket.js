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

    // Initialize socket connection
    useEffect(() => {
        if (!userId || !roomId) return;

        // Clear any existing connection
        if (socketRef.current && isConnected) {
            socketRef.current.disconnect();
        }

        socketRef.current = io(SOCKET_SERVER_URL);

        // Join room
        socketRef.current.on("connect", () => {
            setIsConnected(true);
            socketRef.current.emit('join-room', {
                roomId,
                userId,
                userName
            });
        });

        // Handle new user connected
        socketRef.current.on('user-connected', (user) => {
            setParticipants(prev => [
                ...prev,
                {
                    id: user.socketId,
                    userId: user.userId,
                    name: user.userName,
                    hasVideo: true,
                    hasAudio: true,
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
                userId: user.userId,
                name: user.userName,
                hasVideo: true,
                hasAudio: true,
                initials: `${user.userName.charAt(0)}${user.userName.split(' ')[1] ? user.userName.split(' ')[1].charAt(0) : ''}`,
                isHost: user.isHost
            }));
            setParticipants(formattedParticipants);
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

        // Listen for typing status
        socketRef.current.on('typing-status', ({ users }) => {
            setTypingUsers(users);
        });

        // Handle media state changes
        socketRef.current.on('media-state-change', ({ userId, hasVideo, hasAudio }) => {
            setParticipants(prev =>
                prev.map(p =>
                    p.id === userId ? { ...p, hasVideo, hasAudio } : p
                )
            );
        });

        // Handle user disconnection
        socketRef.current.on('user-disconnected', (socketId) => {
            setParticipants(prev =>
                prev.filter(participant => participant.id !== socketId)
            );
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

    // Update media state for local user
    const updateMediaState = (mediaType, isEnabled) => {
        if (socketRef.current) {
            const stateUpdate = mediaType === 'video'
                ? { hasVideo: isEnabled }
                : { hasAudio: isEnabled };

            socketRef.current.emit('media-state-change', {
                roomId,
                userId: socketRef.current.id,
                ...stateUpdate
            });

            // Update local state immediately
            setParticipants(prev =>
                prev.map(p =>
                    p.id === socketRef.current.id ? { ...p, ...stateUpdate } : p
                )
            );
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

    return {
        socket: socketRef.current,
        isConnected,
        participants,
        setParticipants,
        messages,
        sendMessage,
        sendEmoji,
        emojis,
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
    };
}
