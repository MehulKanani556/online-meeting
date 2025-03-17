// require('dotenv').config();
// const express = require('express');
// const connectDb = require('./db/db');
// // const server = express();
// const indexRoutes = require('./routes/index.routes');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// const path = require('path');

// const app = express();
// const port = process.env.PORT;

// app.use(express.json());
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
// }));

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use('/api', indexRoutes);

// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:3000',
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });

// global.io = io;
// socketManager.initializeSocket(io);

// // io.on('connection', (socket) => {
// //     console.log('Reminder connected');

// //     socket.on('register', (email) => {
// //         socket.join(email);
// //         console.log(`User registered for reminders: ${email}`);
// //     });

// //     socket.emit('reminder', { message: "Welcome! You will receive reminders here." });

// //     socket.on('disconnect', () => {
// //         console.log('Reminder disconnected');
// //     });
// // });

// server.listen(port, () => {
//     connectDb();
//     console.log(`Server Is Connected on port ${port}`);
// });

require('dotenv').config();
const express = require('express');
const connectDb = require('./db/db');
const indexRoutes = require('./routes/index.routes');
const server = express();
const socketPort = process.env.SOCKET_PORT || 5000;
const socketManager = require("./socketManager/SocketManager");
const port = process.env.PORT
const cors = require('cors')
const { Server } = require('socket.io');
const path = require('path')
server.use(express.json())
server.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

server.use("/uploads", express.static(path.join(__dirname, "uploads")));
server.use('/api', indexRoutes);

// Create HTTP server from Express app for Socket.IO
const http = require("http");
const socketServer = http.createServer(server);

// Initialize Socket.IO
const io = new Server(socketServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

global.io = io;
socketManager.initializeSocket(io);

server.listen(port, () => {
    connectDb();
    console.log(`Server Is Connected ${port}`);
})

socketServer.listen(socketPort, () => {
    console.log(`Socket.IO Server Is Running At ${socketPort}`);
});
