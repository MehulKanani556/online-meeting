import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:4000"; // Move to environment variable in production
// const SOCKET_SERVER_URL = "https://online-meeting-backend-le8t.onrender.com"; // Move to environment variable in production

export const useSocket = (userId, roomId, userName) => {
    const socketRef = useRef(null);
    const [reminders, setReminders] = useState([]); // State to hold reminders 
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [emojis, setemojis] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [systemMessages, setSystemMessages] = useState([]);
    const [requestApprovalStatus, setRequestApprovalStatus] = useState(null);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const [notificationPermission, setNotificationPermission] = useState(
        Notification.permission
    );

    useEffect(() => {
        if (Notification.permission === "default") {
            requestNotificationPermission();
        }
    }, []);
    // Function to request notification permission
    const requestNotificationPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            console.log("Notification permission:", permission);
        } catch (error) {
            console.error("Error requesting notification permission:", error);
        }
    };

    // Function to show notification for new message
    const showMessageNotification = (message, senderName) => {
        if (notificationPermission !== "granted") return;

        // Create notification content
        let notificationTitle = senderName || "New Message";
        let notificationBody = message;

        // Create and show the notification
        const notification = new Notification(notificationTitle, {
            body: notificationBody,
            icon: "/Image/logo.svg",
            requireInteraction: true,
            silent: false,
            vibrate: [200, 100, 200],
            tag: "new-message",
            renotify: true,
            dir: "auto",
            lang: "en-US",
            timestamp: new Date().getTime(),
        });

        // Close notification after 5 seconds
        setTimeout(() => {
            notification.close();
        }, 5000);
    };

    // Function to show notification for new joining
    const showJoinNotification = (userName) => {
        if (notificationPermission !== "granted") return;

        // Create and show the notification
        const notification = new Notification("New Join", {
            body: `${userName} has joined the meeting`,
            icon: "/Image/logo.svg",
            requireInteraction: true,
            silent: false,
            vibrate: [200, 100, 200],
            tag: "user-join",
            renotify: true,
            dir: "auto",
            lang: "en-US",
            timestamp: new Date().getTime(),
        });

        // Close notification after 5 seconds
        setTimeout(() => {
            notification.close();
        }, 5000);
    };

    // Initialize socket connection
    useEffect(() => {

        if (!userId) return;

        // Clear any existing connection
        if (socketRef.current && isConnected) {
            socketRef.current.disconnect();
        }

        socketRef.current = io(SOCKET_SERVER_URL);

        // Join room
        socketRef.current.on("connect", () => {
            // console.log("Socket connected:", socketRef.current);
            setIsConnected(true);
            // Emit user-login after connection
            socketRef.current.emit("user-login", userId);
        });

        socketRef.current.emit('join-room', {
            roomId,
            userId,
            userName
        });

        socketRef.current.on("user-status-changed", (onlineUserIds) => {
            // console.log("Online users updated:", onlineUserIds);
        });

        socketRef.current.on('reminder', (data) => {
            console.log("ddddd", data);
            setReminders(prevReminders => [...prevReminders, data.message]); // Add new reminder to state
        });

        const renameParticipant = JSON.parse(sessionStorage.getItem("renameParticipant"));
        // Get list of room users when joining
        socketRef.current.on('room-users', (roomUsers) => {
            const formattedParticipants = roomUsers.map(user => ({
                id: user.id,
                userId: user.userId,
                name: user.userName,
                hasVideo: true,
                hasAudio: true,
                initials: `${user.userName?.charAt(0)}${user.userName?.split(' ')[1] ? user.userName?.split(' ')[1]?.charAt(0) : ''}`,
                isHost: user.isHost
            }));


            if (renameParticipant) {
                const updatedParticipants = formattedParticipants.map(participant => {
                    console.log("participant", participant);

                    const rename = renameParticipant?.find(p => p.participantId === participant.userId);

                    console.log("rename", rename);
                    return rename ? { ...participant, name: rename.newName } : participant;
                });
                console.log("updatedParticipants", updatedParticipants);

                setParticipants(updatedParticipants);
            } else {
                setParticipants(formattedParticipants);
            }

            setSystemMessages([]);
        });

        // Handle new user connected
        socketRef.current.on('user-connected', (user) => {
            if (user.userName && !user.isHost && user.userId !== userId) {
                setSystemMessages(prev => [...prev, {
                    type: 'join',
                    userName: user.userName,
                    timestamp: new Date().toISOString()
                }]);
            }

            // Add participant
            setParticipants(prev => [
                ...prev,
                {
                    id: user.socketId,
                    userId: user.userId,
                    name: user.userName,
                    hasVideo: true,
                    hasAudio: true,
                    initials: `${user.userName?.charAt(0)}${user.userName?.split(' ')[1] ? user.userName?.split(' ')[1]?.charAt(0) : ''}`,
                    isHost: user.isHost
                }
            ]);
        });

        // Handle chat messages
        socketRef.current.on('receive-message', (message) => {
            setMessages(prev => [...prev, message]);
            if (!isChatOpen && message.sender !== userName) {
                setUnreadMessages(prev => prev + 1);
            }
            if (message.sender !== userName) {
                showMessageNotification(message.message, message.sender)
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
        socketRef.current.on('participant-renamed', ({ participantId, newName, participantUserId }) => {

            const renameParticipant = JSON.parse(sessionStorage.getItem("renameParticipant")) || [];
            console.log("renameParticipant", renameParticipant);

            console.log("participantId", participantUserId);

            const obj = {
                roomId,
                participantId: participantUserId,
                newName: newName.trim(),
            }

            if (renameParticipant.length > 0) {
                if (renameParticipant.some(p => p.participantId === participantUserId)) {
                    const updatedParticipants = renameParticipant.map(p => p.participantId === participantUserId ? { ...p, newName: newName.trim() } : p);
                    sessionStorage.setItem("renameParticipant", JSON.stringify(updatedParticipants));
                } else {
                    sessionStorage.setItem("renameParticipant", JSON.stringify([...renameParticipant, obj]));
                }
            } else {
                sessionStorage.setItem("renameParticipant", JSON.stringify([obj]));
            }


            setParticipants(prev => prev.map(participant =>
                participant.id === participantId
                    ? {
                        ...participant,
                        name: newName,
                        initials: `${newName.charAt(0)}${newName.split(' ')[1] ? newName.split(' ')[1].charAt(0) : ''}`
                    }
                    : participant
            ));
            console.log("participants", participants);

        });

        // Handle participant removal
        socketRef.current.on('participant-removed', ({ participantId }) => {
            setParticipants(prev => prev.filter(participant => participant.id !== participantId));
        });

        // Handle media state changes
        socketRef.current.on('media-state-change', (update) => {
            const { userId, hasVideo, hasAudio } = update;

            setParticipants(prev =>
                prev.map(p => {
                    if (p.id === userId) {
                        // Create new participant object with only updated properties
                        const updatedParticipant = { ...p };

                        if (hasVideo !== undefined) {
                            updatedParticipant.hasVideo = hasVideo;
                        }

                        if (hasAudio !== undefined) {
                            updatedParticipant.hasAudio = hasAudio;
                        }

                        return updatedParticipant;
                    }
                    return p;
                })
            );

            console.log("Received media state update:", update);
        });

        // For users waiting for approval
        socketRef.current.on('join-request-status', ({ status, requestId }) => {
            setRequestApprovalStatus(status);

            if (status === 'approved') {
                showJoinNotification(userName);
                // If approved, navigate to meeting room
                socketRef.current.emit('join-room', {
                    roomId,
                    userId,
                    userName
                });
            }
        });

        // For hosts who receive join requests
        socketRef.current.on('join-request', (requestData) => {
            setJoinRequests(prev => [...prev, requestData]);
        });

        // Handle user disconnection
        socketRef.current.on('user-disconnected', (socketId) => {
            // Find the user who disconnected to get their name
            const disconnectedUser = participants.find(p => p.id === socketId);

            // Only show leave message if:
            // 1. We found the user
            // 2. User is not the host
            // 3. User is not the current user
            if (disconnectedUser && !disconnectedUser.isHost && disconnectedUser.userId !== userId) {
                setSystemMessages(prev => [...prev, {
                    type: 'leave',
                    userName: disconnectedUser.name,
                    timestamp: new Date().toISOString()
                }]);
            }

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
        // console.log("mediaType", mediaType, "enabled:", isEnabled);

        if (socketRef.current) {
            // Create an update object with ONLY the property being changed
            const stateUpdate = {};

            if (mediaType === 'video') {
                stateUpdate.hasVideo = isEnabled;
            } else if (mediaType === 'audio') {
                stateUpdate.hasAudio = isEnabled;
            }

            // Make sure we're ONLY sending the changed property to the server
            socketRef.current.emit('media-state-change', {
                roomId,
                userId: socketRef.current.id,
                ...stateUpdate  // This spreads ONLY hasVideo OR hasAudio, not both
            });

            // Update local participants state with ONLY the changed property
            setParticipants(prev =>
                prev.map(p =>
                    p.id === socketRef.current.id ? { ...p, ...stateUpdate } : p
                )
            );

            // Update local state flags if needed
            if (mediaType === 'video') {
                setIsVideoOff(!isEnabled);
            } else if (mediaType === 'audio') {
                setIsMuted(!isEnabled);
            }
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

    // Function for host to handle join requests
    const handleJoinRequest = (requestId, isApproved) => {
        if (socketRef.current) {
            socketRef.current.emit('handle-join-request', {
                requestId,
                status: isApproved ? 'approved' : 'denied',
                roomId
            });

            // Remove the request from the local state
            setJoinRequests(prev => prev.filter(req => req.requestId !== requestId));
        }
    };

    // Function for user to send join request
    const sendJoinRequest = () => {
        if (socketRef.current) {
            const requestId = `${userId}-${Date.now()}`;
            socketRef.current.emit('request-to-join', {
                roomId,
                userId,
                userName,
                requestId,
            });
        }
    };

    return {
        socket: socketRef.current,
        isConnected,
        reminders, // Return reminders state
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
        sendIceCandidate,
        joinRequests,
        handleJoinRequest,
        sendJoinRequest,
        requestApprovalStatus,
        isVideoOff,
        setIsVideoOff,
        isMuted,
        setIsMuted,
        systemMessages
    };
}
