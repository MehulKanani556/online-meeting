const scheduleReminder = require('../controller/schedule.controller')
const schedule = require('../models/schedule.modal')

const onlineUsers = new Map();
const onlineEmails = new Map();

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

            console.log(`The meeting is in ${daysDifference} days.`);

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
                    const socketId = onlineUsers.get(userId);

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
                    const socketId = onlineUsers.get(userId);

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
        onlineUsers.delete(socket.userId);
        // Broadcast updated online users list
        const onlineUsersList = Array.from(onlineUsers.keys());
        global.io.emit("user-status-changed", onlineUsersList);
    }
}

async function handleUserLogin(socket, userId) {
    // Check if the user is already connected
    if (onlineUsers.has(userId)) {
        console.log(`User ${userId} is already connected.`);
        return;
    }

    // Remove any existing socket connection for this user
    for (const [existingUserId, existingSocketId] of onlineUsers.entries()) {
        if (existingUserId === userId && existingSocketId !== socket.id) {
            const existingSocket = global.io.sockets.sockets.get(existingSocketId);
            if (existingSocket) {
                existingSocket.disconnect(); // Disconnect the existing socket
            }
            onlineUsers.delete(existingUserId);
        }
    }

    // Add new socket connection
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;

    // Broadcast updated online users list to all connected clients
    const onlineUsersList = Array.from(onlineUsers.keys());
    global.io.emit("user-status-changed", onlineUsersList);
    // console.log(onlineUsers);
}


async function initializeSocket(io) {
    // console.log("SDvzdvdvdvdv");

    io.on("connection", (socket) => {
        console.log("New socket connection:", socket.id);

        socket.on("user-login", async (userId) => {
            handleUserLogin(socket, userId);
        });

        sendReminder(socket);

        // Handle disconnection
        socket.on("disconnect", () => handleDisconnect(socket));
    });

}

module.exports = {
    initializeSocket,
};