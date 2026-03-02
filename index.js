const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = 3000;

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

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
