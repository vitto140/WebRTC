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
                flowersHTML += `<img src="cid:${cid}" style="width: 250px; height: 250px;" alt="Flower">`;
            });
        }

        attachments.push({
            filename: 'vase.png',
            path: './public/assets/vase.png',
            cid: 'vase@loveyours.com'
        });


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
            <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%);
                    padding: 40px 20px;
                    text-align: center;
                    color: white;
                }
                .header h1 {
                    margin: 0;
                    font-size: 2.5em;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
                }
                .content {
                    padding: 40px 20px;
                    text-align: center;
                    background: #FFF9BF;
                }
                .message {
                    font-size: 1.2em;
                    color: #C9245A;
                    font-style: italic;
                    margin: 20px 0;
                    line-height: 1.6;
                }
                .bouquet-container {
                    position: relative;
                    display: inline-block;
                    margin: 30px 0;
                }
                .vase {
                    width: 250px;
                    height: auto;
                    display: block;
                    margin: 0 auto;
                }
                .flowers {
                    position: absolute;
                    bottom: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: -20px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .flower {
                    width: 250px;
                    height: 250px;
                    margin: 0 -10px;
                    animation: sway 3s ease-in-out infinite;
                }
                .flower:nth-child(1) { animation-delay: 0s; }
                .flower:nth-child(2) { animation-delay: 0.3s; }
                .flower:nth-child(3) { animation-delay: 0.6s; }
                @keyframes sway {
                    0%, 100% { transform: rotate(-2deg); }
                    50% { transform: rotate(2deg); }
                }
                .hearts {
                    font-size: 2em;
                    margin: 20px 0;
                }
                .footer {
                    background: #fff8f0;
                    padding: 20px;
                    text-align: center;
                    color: #666;
                    font-size: 0.9em;
                }
                .voice-badge {
                    display: inline-block;
                    background: #ff6b9d;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 20px;
                    margin: 20px 0;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>💐 You Received a Bouquet!</h1>
                </div>

                <div class="content">
                    <div class="message">
                        "${message || "Someone special sent you flowers! 🌸"}"
                    </div>        
                    <div class="bouquet-container">
                        <div class="flowers">
                            ${flowersHTML}
                        </div>
                        <img src="cid:vase@loveyours.com" 
                             class="vase" 
                             alt="Vase"
                             style="width: 200px; height: auto; opacity: 0.9;">
                    </div>

                            ${voiceHTML ? `<audio controls class="voice-badge">🎤 Voice Message Attached</audio>` : ''}
                    
                    <div style="margin-top: 30px; color: #ff6b9d; font-size: 1.1em;">
                        Made with love 💝
                    </div>
                </div>
                
                <div class="footer">
                    <p>Sent via LoveYours Digital Flower Shop</p>
                    <p>© 2026 Creative Code – Vittoria Romano</p>
                </div>
            </div>
        </body>
        </html>
        
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
