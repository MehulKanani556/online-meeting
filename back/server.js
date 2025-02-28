require('dotenv').config();
const express = require('express');
const connectDb = require('./db/db');
const indexRoutes = require('./routes/index.routes');
const server = express();
const port = process.env.PORT
const cors = require('cors')
const path = require('path')
server.use(express.json())
server.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

server.use("/uploads", express.static(path.join(__dirname, "uploads")));
server.use('/api', indexRoutes);

server.listen(port, () => {
    connectDb();
    console.log(`Server Is Connected ${port}`);
})
