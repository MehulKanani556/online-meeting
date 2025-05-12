require('dotenv').config();
const express = require('express');
const connectDb = require('./db/db');
const cors = require('cors')
const path = require('path')
const http = require("http");
const { Server } = require('socket.io');
const indexRoutes = require('./routes/index.routes');
const socketManager = require("./socketManager/SocketManager");


const app = express();
const port = process.env.PORT || 4000
// const socketPort = process.env.SOCKET_PORT || 5000;

app.use(express.json())
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api', indexRoutes);

// Create a single HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

global.io = io;
socketManager.initializeSocket(io);

// Define a root route
app.get('/', (req, res) => {
    res.send('Hello Zoom Meeting ! 😁 🎈');
});

server.listen(port, () => {
    connectDb();
    console.log(`Server (HTTP + Socket.IO) is running on port ${port}`);
})
