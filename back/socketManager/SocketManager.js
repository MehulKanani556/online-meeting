const { createchat } = require('../controller/chat.controller');
const schedule = require('../models/schedule.modal')
const personalroom = require('../models/personalroom.models')

const onlineUsers = new Map();
const rooms = {};
const typingUsers = new Map(); // Store typing status for each room
const joinRequests = new Map(); // Map of roomId -> array of requests
const screenShareData = new Map();
const listOnlineUsers = new Map();

console.log("listOnlineUsers", listOnlineUsers);

async function sendReminder(socket) {
    const data = await schedule.find();

    // console.log("Inveetssss data", data);

    if (data.length > 0) {
        data.forEach(meeting => {
            const { invitees, title, date, startTime, reminder } = meeting;
            const reminderMinutes = reminder.map(rem => {
                const parts = rem.split(' ');
                const value = parseInt(parts[0]);
                const unit = parts[1].toLowerCase();

                // Convert to minutes based on the unit
                if (unit.startsWith('min')) {
                    return value; // Already in minutes
                } else if (unit.startsWith('hr')) {
                    return value * 60; // Convert hours to minutes
                } else if (unit.startsWith('day')) {
                    return value * 1440; // Convert days to minutes
                } else if (unit.startsWith('days')) {
                    return value * 1440; // Convert days to minutes
                }
                return 0; // Default case if unit is unrecognized
            });

            const now = new Date();
            const meetingdate = new Date(date);

            // Calculate the difference in time
            const timeDifference = meetingdate - now; // Difference in milliseconds
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days

            // console.log(`The meeting is in ${daysDifference} days.`);

            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`; // Format current time
            const startParts = startTime.split(':');
            const currentParts = currentTime.split(':');

            const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
            const currentMinutes = parseInt(currentParts[0]) * 60 + parseInt(currentParts[1]);

            if (reminderMinutes.includes(startMinutes - currentMinutes)) {
                const reminderTime = startMinutes - currentMinutes;
                const reminderMessage = reminderTime === 60 ?
                    `Your meeting "${title}" starts in 1 hour at ${startTime}.` :
                    reminderTime === 120 ?
                        `Your meeting "${title}" starts in 2 hours at ${startTime}.` :
                        `Your meeting "${title}" starts in ${reminderTime} minutes at ${startTime}.`;

                invitees.forEach(v => {
                    const userId = v.userId.toString();
                    const socketId = onlineUsers[userId];

                    if (socketId) {
                        console.log(`Sending reminder to ${userId}: ${reminderMessage}`);
                        socket.to(socketId).emit('reminder', {
                            message: reminderMessage
                        });
                    } else {
                        console.log(`No socketId found for userId: ${userId}. They may not be connected.`);
                    }
                });
            } else if (startMinutes - currentMinutes == 0 && daysDifference > 0) {
                invitees.forEach(v => {
                    const userId = v.userId.toString();
                    const socketId = onlineUsers[userId];

                    if (socketId) {
                        socket.to(socketId).emit('reminder', {
                            message: `Your meeting "${title}" starts in ${daysDifference} Days at ${startTime}.`
                        });
                    } else {
                        console.log(`No socketId found for userId: ${userId}. They may not be connected.`);
                    }
                });
            }
        });
    }
}

function handleDisconnect(socket) {
    if (socket.userId) {
        delete onlineUsers[socket.userId];

        listOnlineUsers.delete(socket.userId);
        // Broadcast updated online users list
        const onlineUsersList = Array.from(listOnlineUsers.keys());
        global.io.emit("user-status-changed", onlineUsersList);
    }
}

async function handleUserLogin(socket, userId) {
    // Remove any existing socket connection for this user
    if (listOnlineUsers.has(userId)) {
        const oldSocketId = listOnlineUsers.get(userId);
        if (oldSocketId !== socket.id) {
            const existingSocket = global.io.sockets.sockets.get(oldSocketId);
            if (existingSocket) {
                existingSocket.disconnect(); // Disconnect the existing socket
            }
            listOnlineUsers.delete(userId);
        }
    }

    // Add or update the user's socket connection
    listOnlineUsers.set(userId, socket.id);
    socket.userId = userId;

    // Broadcast updated online users list
    const onlineUsersList = Array.from(listOnlineUsers.keys());
    global.io.emit("user-status-changed", onlineUsersList);
}

async function initializeSocket(io) {
    // console.log("SDvzdvdvdvdv");

    io.on("connection", (socket) => {
        console.log("New socket connection:", socket.id);

        // User joins a room
        socket.on('join-room', async ({ roomId, userId, userName, hostUserId = null, screenShare }) => {

            if (!roomId) {
                socket.emit('error', { message: 'Room ID is required' });
                return;
            }

            if (!userId) {
                socket.emit('error', { message: 'User ID is required' });
                return;
            }

            try {
                // Initialize rooms[roomId] if it doesn't exist
                if (!rooms[roomId]) {
                    rooms[roomId] = [];
                }

                if (!(screenShareData[roomId] == true || screenShareData[roomId] == false)) {
                    screenShareData[roomId] = screenShare == true ? true : false;
                }

                // Check for existing user
                const existingUser = rooms[roomId].find(user => user.userId === userId);
                if (existingUser) {
                    // Remove the existing user entry
                    rooms[roomId] = rooms[roomId].filter(user => user.userId !== userId);
                    // Notify others about disconnection of the old session
                    socket.to(roomId).emit('user-disconnected', existingUser.id);
                }

                // Get meeting details from the database
                const meetingDetails = await schedule.findOne({
                    meetingLink: { $regex: String(roomId) } // Ensure roomId is a string
                });

                if (!hostUserId) {
                    hostUserId = meetingDetails?.userId?.toString();
                }

                // Add participant to the meeting's participants array if not already present
                if (meetingDetails && !meetingDetails.participants.includes(userId)) {
                    await schedule.findByIdAndUpdate(
                        meetingDetails._id,
                        { $addToSet: { participants: userId } }
                    );
                }

                // Join the room
                socket.join(roomId);

                onlineUsers[socket.id] = {
                    userId,
                    userName,
                    roomId
                };

                if (roomId) {
                    rooms[roomId].push({
                        id: socket.id,
                        userId,
                        userName,
                        screenShare: screenShareData[roomId],
                        isHost: userId === hostUserId
                    });

                    socket.to(roomId).emit('user-connected', {
                        socketId: socket.id,
                        userId,
                        userName,
                        screenShare: screenShareData[roomId],
                        isHost: userId === hostUserId
                    });
                    socket.emit('room-users', rooms[roomId]);

                    if (userId == hostUserId) {
                        const notifiedUsers = new Set();
                        console.log("zvvvvvvvvvvvvvvvvvvdddddddddddddddddddddd");

                        (meetingDetails.invitees || []).forEach(invitee => {
                            const inviteeUserId = invitee.userId && invitee.userId.toString();
                            if (notifiedUsers.has(inviteeUserId)) {
                                return;
                            }
                            const socketId = listOnlineUsers.get(inviteeUserId)
                            console.log("socketId------------------------------------", socketId, inviteeUserId.toString());

                            if (socketId) {
                                notifiedUsers.add(inviteeUserId);
                                socket.to(socketId).emit('meeting-started', {
                                    message: 'The host has started the meeting.',
                                    hostUserId,
                                    roomId,
                                    timestamp: Date.now()
                                });
                            }
                        });
                    }
                }
            } catch (error) {
                console.error("Error in join-room:", error);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        // Handle WebRTC signaling
        socket.on('offer', ({ to, from, offer }) => {
            io.to(to).emit('offer', {
                from,
                offer
            });
        });

        socket.on('answer', ({ to, from, answer }) => {
            io.to(to).emit('answer', {
                from,
                answer
            });
        });

        socket.on('ice-candidate', ({ to, candidate }) => {
            io.to(to).emit('ice-candidate', {
                from: socket.id,
                candidate
            });
        });

        socket.on('media-state-change', ({ roomId, userId, hasVideo, hasAudio }) => {
            // Find the user in the room
            if (rooms[roomId]) {
                const userIndex = rooms[roomId].findIndex(user => user.id === socket.id);

                if (userIndex !== -1) {
                    // Create update object with only the properties that were sent
                    const updatePayload = {};

                    if (hasVideo !== undefined) {
                        updatePayload.hasVideo = hasVideo;
                    }

                    if (hasAudio !== undefined) {
                        updatePayload.hasAudio = hasAudio;
                    }

                    // Update the user with only the changed properties
                    rooms[roomId][userIndex] = {
                        ...rooms[roomId][userIndex],
                        ...updatePayload
                    };

                    // Broadcast to everyone else in the room
                    socket.to(roomId).emit('media-state-change', {
                        userId: socket.id,
                        ...updatePayload  // Only send what changed
                    });

                    console.log(`User ${socket.id} media state updated:`, updatePayload);
                }
            }
        });

        socket.on('user-typing', ({ roomId, userId, userName, isTyping }) => {
            // Get or initialize typing users for this room
            let roomTypingUsers = typingUsers.get(roomId) || new Map();

            if (isTyping) {
                // Add typing user
                roomTypingUsers.set(userId, { userId, userName });
            } else {
                // Remove typing user
                roomTypingUsers.delete(userId);
            }

            typingUsers.set(roomId, roomTypingUsers);

            // Emit updated typing status to room
            io.to(roomId).emit('typing-status', {
                users: Array.from(roomTypingUsers.values())
            });
        });

        // Chat functionality
        socket.on('send-message', ({ roomId, message, sender, senderId, ReceiverId }) => {
            io.to(roomId).emit('receive-message', {
                sender,
                message,
                timestamp: new Date().toISOString()
            });
            createchat({ sender, meetingId: roomId, senderId, ReceiverId, message })
        });

        socket.on("user-login", async (userId) => {
            handleUserLogin(socket, userId);
        });

        sendReminder(socket);

        // Handle sending emojis
        socket.on('send-emoji', ({ roomId, emoji, sender }) => {
            io.to(roomId).emit('receive-emoji', {
                sender,
                emoji,
                timestamp: new Date().toISOString()
            });
        });

        // Add hand raise status handler
        socket.on('hand-status-change', ({ roomId, hasRaisedHand }) => {
            if (rooms[roomId]) {
                rooms[roomId] = rooms[roomId].map(user =>
                    user.id === socket.id
                        ? { ...user, hasRaisedHand }
                        : user
                );

                // Broadcast the hand raise status change to all users in the room
                io.to(roomId).emit('hand-status-updated', {
                    userId: socket.id,
                    hasRaisedHand
                });
            }
        });

        // Add video status change handler
        socket.on('video-status-change', ({ roomId, hasVideo }) => {
            if (rooms[roomId]) {
                rooms[roomId] = rooms[roomId].map(user =>
                    user.id === socket.id
                        ? { ...user, hasVideo }
                        : user
                );

                // Broadcast the video status change to all users in the room
                io.to(roomId).emit('video-status-updated', {
                    userId: socket.id,
                    hasVideo
                });
            }
        });

        // Handle join requests
        socket.on('request-to-join', async ({ roomId, userId, userName, password, requestId }) => {
            try {
                // Find the meeting details from the database
                const meetingDetails = await schedule.findOne({
                    meetingLink: { $regex: roomId }
                });
                const personal = await personalroom.findOne({
                    MeetingID: { roomId }
                });

                if (!meetingDetails && !personal) {
                    socket.emit('join-request-status', {
                        status: 'error',
                        message: 'Meeting not found.'
                    });
                    return;
                }

                // Check if the password is required and validate it
                if (meetingDetails.password && meetingDetails.password !== password) {
                    socket.emit('join-request-status', {
                        status: 'error',
                        message: 'Incorrect password.'
                    });
                    return;
                }

                // Create a unique request ID if not provided
                const reqId = requestId || `${userId}-${Date.now()}`;

                // Find the room and its host
                if (!rooms[roomId] || rooms[roomId].length === 0) {
                    socket.emit('join-request-status', {
                        status: 'error',
                        message: 'Meeting not found or no host available.'
                    });
                    return;
                }

                // Find the host of the meeting
                const host = rooms[roomId].find(user => user.isHost);

                if (!host) {
                    socket.emit('join-request-status', {
                        status: 'error',
                        message: 'No host available for this meeting.'
                    });
                    return;
                }

                // Store the request
                if (!joinRequests.has(roomId)) {
                    joinRequests.set(roomId, []);
                }

                const request = {
                    requestId: reqId,
                    userId,
                    userName,
                    socketId: socket.id,
                    timestamp: new Date()
                };

                joinRequests.get(roomId).push(request);

                // Send join request to the host
                io.to(host.id).emit('join-request', request);

                // Inform the requester that their request has been sent
                socket.emit('join-request-status', {
                    status: 'pending',
                    requestId: reqId,
                    message: 'Your request has been sent to the host.'
                });

            } catch (error) {
                console.error("Error in request-to-join:", error);
                socket.emit('join-request-status', {
                    status: 'error',
                    message: 'Failed to send join request.'
                });
            }
        });

        // Handle host's response to join requests
        socket.on('handle-join-request', ({ requestId, status, roomId }) => {
            try {
                // Find the request in our stored requests
                const roomRequests = joinRequests.get(roomId) || [];
                const requestIndex = roomRequests.findIndex(req => req.requestId === requestId);

                if (requestIndex === -1) {
                    socket.emit('error', { message: 'Join request not found.' });
                    return;
                }

                const request = roomRequests[requestIndex];

                // Send the status to the requester
                io.to(request.socketId).emit('join-request-status', {
                    status,
                    requestId
                });

                // Remove the request
                roomRequests.splice(requestIndex, 1);
                joinRequests.set(roomId, roomRequests);

                console.log(`Join request ${requestId} was ${status} by host in room ${roomId}`);

            } catch (error) {
                console.error("Error in handle-join-request:", error);
                socket.emit('error', { message: 'Failed to process join request response.' });
            }
        });

        // make host
        socket.on('make-host', ({ roomId, newHostId }) => {
            io.to(roomId).emit('host-updated', { newHostId });
        });

        // make co-host
        socket.on('make-cohost', ({ roomId, newCohostId }) => {
            io.to(roomId).emit('cohost-updated', { newCohostId });
        });

        // rename participant
        socket.on('rename-participant', ({ roomId, participantId, newName, userId }) => {
            io.to(roomId).emit('participant-renamed', { participantId, newName, participantUserId: userId });
        });

        // remove participant
        socket.on('remove-participant', ({ roomId, participantId, participantuserId }) => {
            io.to(roomId).emit('participant-removed', { participantId });
            // Also disconnect the removed user's socket
            const userSocket = io.sockets.sockets.get(participantId);
            if (userSocket) {
                userSocket.disconnect();
            }

            rooms[roomId] = rooms[roomId].filter(user => user.userId !== participantuserId);
        });

        // mute all users
        socket.on('mute-all-users', ({ roomId, hostId }) => {
            // Broadcast to ALL users in the room including the host
            io.to(roomId).emit('mute-all-users', { hostId });
        });

        // User disconnects
        socket.on('disconnect', () => {
            const user = onlineUsers[socket.id]; // Changed from users to onlineUsers

            if (user) {
                const roomId = user.roomId;

                // Remove user from rooms
                if (rooms[roomId]) {
                    rooms[roomId] = rooms[roomId].filter(
                        participant => participant.id !== socket.id
                    );

                    // Delete room if empty
                    if (rooms[roomId].length === 0) {
                        delete rooms[roomId];
                    } else {
                        // Notify others about disconnection
                        socket.to(roomId).emit('user-disconnected', socket.id);
                    }
                }

                // Remove user from onlineUsers
                delete onlineUsers[socket.id]; // Changed from users to onlineUsers
            }

            console.log('User disconnected:', socket.id);
        });

        // Handle recording status updates
        socket.on('recording-status-change', ({ roomId, isRecording }) => {
            // Broadcast recording status to all users in the room except sender
            socket.to(roomId).emit('recording-status-change', {
                userId: socket.id,
                isRecording
            });
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            handleDisconnect(socket);
            // Clean up typing status when user disconnects
            typingUsers.forEach((roomUsers, roomId) => {
                if (roomUsers.has(socket.userId)) {
                    roomUsers.delete(socket.userId);
                    io.to(roomId).emit('typing-status', {
                        users: Array.from(roomUsers.values())
                    });
                }
            });
        });
    });
}

module.exports = {
    initializeSocket,
};