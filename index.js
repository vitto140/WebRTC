require('dotenv').config();
const isDevelopment = (process.env.NODE_ENV === 'development');
const express = require('express');
const app = express();
const fs = require('fs');
const { networkInterfaces } = require('os');

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

app.use(express.json());

app.post('/send-email', async (req, res) => {
    console.log(req.body);
    try {
        const { recipient, message, flowers, voiceNote } = req.body;

        const attachments = [];
        let flowersHTML = '';
        if (flowers && flowers.length > 0) {
            flowers.forEach((flowerPath, index) => {
                const cid = `flower${index}@loveyours.com`;

                // Add to attachments
                attachments.push({
                    filename: `flower${index}.png`,
                    path: `./public/${flowerPath}`,
                    cid: cid
                });

                // Reference in HTML using cid
                flowersHTML += `<img src="cid:${cid}" style="width: 100px; height: 100px; margin: 5px;" alt="Flower">`;
            });
        }

        // Voice note HTML (link to play)
        let voiceHTML = '';
        if (voiceNote) {
            const voiceBuffer = Buffer.from(voiceNote, 'base64');
            attachments.push({
                filename: 'voice-message.webm',
                content: voiceBuffer,
                contentType: 'audio/webm'
            });
            voiceHTML = `<p>🎤 Voice message attached (check attachments)</p>`;
        }

        const info = await transporter.sendMail({
            from: '"LoveYours 💐" <noreply@loveyours.com>',
            to: recipient,
            subject: "Someone sent you a bouquet! 💐",
            text: message || "You received a beautiful bouquet!",
            html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px;">
          <h1 style="color: #ff6b9d;">💐 You received a bouquet!</h1>
          <p style="font-size: 18px;">${message || "Someone sent you flowers!"}</p>
            <div style="margin: 20px 0;">
                ${flowersHTML}
            </div>
            ${voiceHTML}
        </div>

      `,
            attachments: attachments
        });

        console.log("✉️ Email sent:", info.messageId);
        res.json({ success: true, messageId: info.messageId });

    } catch (err) {
        console.error("❌ Email error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
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
