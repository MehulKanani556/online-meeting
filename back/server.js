require('dotenv').config();
const express = require('express');
const connectDb = require('./db/db');
const indexRoutes = require('./routes/index.routes');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api', indexRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('register', (email) => {
        socket.join(email);
    });

    socket.on('sendReminder', (reminder) => {
        socket.emit('reminder', { message: reminder });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    connectDb();
    console.log(`Server Is Connected on port ${port}`);
});
