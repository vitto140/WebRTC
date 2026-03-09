require('dotenv').config();
const isDevelopment = (process.env.NODE_ENV === 'development');
const express = require('express');
const app = express();
const fs = require('fs');
const nodemailer = require("nodemailer")

const nodemailer = require("nodemailer");

// transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


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


//email sending example
(async () => {
    try {
        const info = await transporter.sendMail({
            from: '"Example Team" <team@example.com>', // sender address
            to: "alice@example.com, bob@example.com", // list of recipients
            subject: "Hello", // subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // HTML body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail", err);
    }
})();

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
