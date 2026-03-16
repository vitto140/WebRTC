require('dotenv').config();
const isDevelopment = (process.env.NODE_ENV === 'development');
const express = require('express');
const app = express();
const fs = require('fs');
const { networkInterfaces } = require('os');

let options = {};
if (isDevelopment) {
    options = {
        key: fs.readFileSync('./localhost.key'),
        cert: fs.readFileSync('./localhost.crt')
    };
}
const server = require(isDevelopment ? 'https' : 'http').Server(options, app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = 3000;

const nets = networkInterfaces();
const addresses = Object.values(nets)
    .flat()
    .filter(net => net.family === 'IPv4' && !net.internal)
    .map(net => net.address);


app.use(express.static('public'));

const users = {};

io.on('connection', socket => {
    console.log('Connection:', socket.id);

    users[socket.id] = { id: socket.id };

    socket.on('signal', (peerId, signal) => {
        console.log(`Received signal from ${socket.id} to ${peerId}`);
        io.to(peerId).emit('signal', socket.id, signal);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected:', socket.id);
        socket.broadcast.emit('peer-disconnected', socket.id);
        delete users[socket.id];
    });
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on https://localhost:${port}`);
    addresses.forEach(address => {
        console.log(`📱 Phone: https://${address}:${port}`);
    });
});
