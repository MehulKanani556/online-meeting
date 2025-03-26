const scheduleReminder = require('../controller/schedule.controller')
const schedule = require('../models/schedule.modal')

const onlineUsers = new Map();
const onlineEmails = new Map();
const rooms = {};
// console.log("onlineUsers", onlineUsers);

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
                        // console.log(`Sending reminder to ${userId}: ${reminderMessage}`);
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
        // Broadcast updated online users list
        const onlineUsersList = Object.keys(onlineUsers);
        global.io.emit("user-status-changed", onlineUsersList);
    }
}

async function handleUserLogin(socket, userId) {
    // Check if the user is already connected
    if (onlineUsers.hasOwnProperty(userId)) {
        // console.log(`User ${userId} is already connected.`);
        return;
    }

    // Remove any existing socket connection for this user
    for (const existingUserId in onlineUsers) {
        if (existingUserId === userId && onlineUsers[existingUserId] !== socket.id) {
            const existingSocket = global.io.sockets.sockets.get(onlineUsers[existingUserId]);
            if (existingSocket) {
                existingSocket.disconnect(); // Disconnect the existing socket
            }
            delete onlineUsers[existingUserId];
        }
    }

    // Add new socket connection
    onlineUsers[userId] = socket.id;
    socket.userId = userId;

    // Broadcast updated online users list to all connected clients
    const onlineUsersList = Object.keys(onlineUsers);
    global.io.emit("user-status-changed", onlineUsersList);
    // console.log(onlineUsers);
}

async function initializeSocket(io) {
    // console.log("SDvzdvdvdvdv");

    io.on("connection", (socket) => {
        console.log("New socket connection:", socket.id);

        // User joins a room
        socket.on('join-room', async ({ roomId, userId, userName }) => {
            try {
                // Initialize rooms[roomId] if it doesn't exist
                if (!rooms[roomId]) {
                    rooms[roomId] = [];
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
                    meetingLink: { $regex: roomId }
                });

                const hostUserId = meetingDetails?.userId?.toString();

                // Join the room
                socket.join(roomId);

                onlineUsers[socket.id] = {
                    userId,
                    userName,
                    roomId
                };

                // Add user to room participants
                rooms[roomId].push({
                    id: socket.id,
                    userId,
                    userName,
                    hasVideo: false, // Set to false initially
                    hasAudio: false, // Set to false initially
                    isHost: userId === hostUserId
                });

                // Notify others in the room
                socket.to(roomId).emit('user-connected', {
                    socketId: socket.id,
                    userId,
                    userName,
                    hasVideo: false, // Send hasVideo status as false
                    hasAudio: false, // Send hasAudio status as false
                    isHost: userId === hostUserId
                });

                // Send list of all users in the room to the new participant
                socket.emit('room-users', rooms[roomId]);
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

        // Chat functionality
        socket.on('send-message', ({ roomId, message, sender }) => {
            io.to(roomId).emit('receive-message', {
                sender,
                message,
                timestamp: new Date().toISOString()
            });
        });

        socket.on("user-login", async (userId) => {
            handleUserLogin(socket, userId);
        });

        // Handle sending emojis
        socket.on('send-emoji', ({ roomId, emoji, sender }) => {
            io.to(roomId).emit('receive-emoji', {
                sender,
                emoji,
                timestamp: new Date().toISOString()
            });
        });


        socket.on('audio-status-change', ({ roomId, hasAudio }) => {
            // Update the user's audio status in the rooms data structure
            if (rooms[roomId]) {
                rooms[roomId] = rooms[roomId].map(user =>
                    user.id === socket.id
                        ? { ...user, hasAudio } // Update hasAudio
                        : user
                );

                // Broadcast the audio status change to all users in the room
                io.to(roomId).emit('audio-status-updated', {
                    userId: socket.id,
                    hasAudio
                });
            }
        });

        socket.on('video-status-change', ({ roomId, hasVideo }) => {
            // Update the user's video status in the rooms data structure
            if (rooms[roomId]) {
                rooms[roomId] = rooms[roomId].map(user =>
                    user.id === socket.id
                        ? { ...user, hasVideo } // Update hasVideo
                        : user
                );

                // Broadcast the video status change to all users in the room
                io.to(roomId).emit('video-status-updated', {
                    userId: socket.id,
                    hasVideo
                });
            }
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

        sendReminder(socket);

        // Handle disconnection
        socket.on("disconnect", () => handleDisconnect(socket));
    });
}

module.exports = {
    initializeSocket,
};