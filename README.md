#  LoveYours – WebRTC Flower Bouquet Creator

##  Core Idea

**LoveYours** is a real-time collaborative web application that allows users to create and send personalized digital flower bouquets.

The phone acts as a **remote controller**, while the desktop acts as a **live display**. Both devices connect using **WebRTC peer-to-peer communication**, enabling low-latency, real-time interaction.

**Users can:**
- Select flowers from a carousel
- Write a personalized message
- Record a voice message
- Send the final bouquet via email

Devices are paired through a **QR code system**, making the experience seamless and intuitive.

---

## 🏗️ Architecture Overview

📌 **Full development diary:**  
[View on Figma](https://www.figma.com/board/zS6EDmdmtjWqm5HzuJ4ACg/CC4-DIARY?node-id=0-1&t=rhjQLejusCXPl1Rd-1)

LoveYours uses a **hybrid architecture** combining WebRTC and WebSockets.

### 🔗 WebRTC (Peer-to-Peer)

**Used for:**
- Real-time flower selection
- Voice message transfer
- Control commands

Once connected, devices communicate **directly** via a WebRTC Data Channel with no server intermediary.

### 🔌 WebSocket (Signaling Only)

**Used for:**
- Exchanging WebRTC offer/answer
- Exchanging ICE candidates
- Matching phone and desktop sessions

WebSockets are only used **during the connection setup phase**.

### 🖥️ Node.js Backend

**Handles:**
- Hosting static frontend files
- WebSocket signalling (Socket.io)
- Email sending via SMTP (Nodemailer)

### 🌐 External Services

- **SMTP Provider:** Gmail
- **STUN Server:** Google STUN servers for NAT traversal

---

## 🧰 Technology Stack

### Frontend
- HTML5
- CSS3 (with CSS variables)
- Vanilla JavaScript (ES6+)
- WebRTC APIs
- MediaRecorder API
- QRCode.js

### Backend
- Node.js
- Express.js
- Socket.io
- Nodemailer (v6)
- ffmpeg-static
- fluent-ffmpeg

---

## 🚀 How To Run The Project Locally

### 📋 Prerequisites
- **Node.js** (v14 or higher)
- **Gmail account** with 2FA enabled and App Password generated
- **Same WiFi network** for both desktop and mobile devices

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/vitto140/WebRTC.git
cd WebRTC
```

---

### 2️⃣ Install Dependencies
```bash
npm install
```

**This installs:**
- `express` - Web server
- `socket.io` - WebSocket signaling
- `nodemailer@6` - Email delivery (must be v6)
- `dotenv` - Environment variables
- `ffmpeg-static` - Audio conversion
- `fluent-ffmpeg` - Audio processing

---

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory:
```env
NODE_ENV=development
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
```

**How to get Gmail App Password:**
1. Enable 2FA on your Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Generate a new app password for "Mail"
4. Copy the 16-character password (no spaces!)

---

### 4️⃣ Generate SSL Certificate

**Check your current IP address:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Option A: Manual Generation**
```bash
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=YOUR_IP_HERE' -extensions EXT -config <( \
   printf "[dn]\nCN=YOUR_IP_HERE\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost,IP:YOUR_IP_HERE\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

Replace `YOUR_IP_HERE` with your actual IP (e.g., `192.168.1.100`)

**Option B: Automated Script**
```bash
chmod +x setup.sh
./setup.sh
```

This script:
- Auto-detects your IP
- Generates the SSL certificate
- Starts the server

---

### 5️⃣ Start the Server
```bash
npm start
```

**Expected output:**
```
Server running on https://localhost:3000
📱 Phone: https://1xx.xxx.x.x:3000
```

---

### 6️⃣ Access the Application

**💻 On Desktop:**
1. Open browser and go to `https://YOUR_IP:3000` (**NOT** `localhost`!)
2. Accept the SSL certificate warning (click "Advanced" → "Proceed")
3. A QR code will appear on screen

**📱 On Phone:**
1. Scan the QR code with your phone camera
2. Accept the SSL certificate warning
3. Controller interface loads
4. Click **"🔊 Enable Audio"** button on desktop (required for voice playback)

**Example URLs:**
- Desktop: `https://192.168.1.100:3000`
- Phone: Scan QR code (automatically contains correct IP)

---

## 🔧 Troubleshooting

### Problem: "This site can't be reached"
**Solutions:**
- Both devices on same WiFi network
- Regenerate SSL certificate with correct IP address
- Server listening on `0.0.0.0` (check `index.js`)

### Problem: "Voice message not playing"
**Solution:**
- Click the **"Enable Audio"** button on desktop first
- This is required by browser autoplay policies

### Problem: "Email not sending"
**Solutions:**
- Check `.env` file has correct Gmail credentials
- Remove any spaces from `SMTP_PASS`
- Only Gmail addresses are supported
- Using Nodemailer v6 (not v8)

### Problem: "Phone can't connect after changing WiFi"
**Solution:**
- Run `./setup.sh` to regenerate certificate with new IP
- OR manually regenerate certificate with updated IP address

---

## ⚠️ Important Notes

- **HTTPS is required** for iOS Safari microphone access
- **Desktop must be accessed via IP address** (not localhost) for QR code to work
- **Gmail only** - other email providers are not supported
- **Certificate expires** when you change networks - regenerate with new IP
- **Voice recordings** are limited to 30 seconds

---
## IDEAL Development Roadmap
### Week 1 
- Project planning and research
- Technical documentation
- User flow design
### Week 2
- WebRTC connection with QR pairing
- Basic flower selection and rendering
- Console logging to prove data flow
### Week 3
- Complete UI design (phone + desktop)
- Live text synchronization
- Email sending functionality
### Week 4
- Voice message recording and playback
- Polish animations and transitions
- Final testing and bug fixes
### Week 5 (If time)
- Implement 1-2 bonus features
- Performance optimization
- Comprehensive README update

## 📅 REAL Development Timeline

### Week 1 - Planning & Research
- Project planning and research
- Created technical documentation and user flow diagrams
- Defined project concept: phone-controlled bouquet creator using WebRTC
- Set up initial project structure with Express server and static files

### Week 2 - Core WebRTC Implementation
- Implemented WebSocket signalling server with Socket.io for peer discovery
- Established WebRTC peer-to-peer data channel communication
- Created QR code pairing system for seamless phone-desktop connection
- Built flower carousel on phone controller with real-time rendering on desktop
- Debugged ICE candidate exchange and connection state issues
- Successfully tested flower selection sending from phone to desktop display

### Week 3 - UI & Voice Features
- Designed and implemented complete UI for both phone controller and desktop display
- Integrated voice message recording using MediaRecorder API
- **Challenge:** iOS Safari blocked microphone access due to HTTP security restrictions
- Configured HTTPS with self-signed SSL certificates (OpenSSL) for development
- Updated server to use conditional HTTPS/HTTP based on environment (dotenv)
- Successfully implemented voice recording, transmission via WebRTC, and automatic playback on desktop
- Added Nodemailer integration for email delivery functionality

### Week 4 - Voice Messaging & Mobile Compatibility
- Focused on implementing voice messaging functionality and resolving critical mobile compatibility issues
- Configured HTTPS using self-signed SSL certificates generated with OpenSSL (including both localhost and LAN IP in the certificate SAN)
- Server updated to conditionally use HTTPS in development via dotenv and bound to 0.0.0.0
- Implemented MediaRecorder API with audio data encoded to base64 and transmitted over WebRTC Data Channels
- Created JSON message protocol to differentiate between flowers, voice data, and control commands
- Overcame browser security hurdle by adding "Enable Audio" button to satisfy autoplay policy requirements
- Integrated email delivery functionality using Nodemailer with Gmail SMTP
- Added DONE button workflow that reveals email form, sends bouquet notification, and displays confirmation on both devices
- Debugged: certificate regeneration when Mac IP changed, Nodemailer version compatibility (v8→v6), SMTP password formatting, WebRTC connection stability with multiple STUN servers

### Week 5 - Email Template & Final Polish
- Completed email delivery system with embedded images using Nodemailer's CID (Content-ID) system
- Converted voice messages from WebM to MP3 format using ffmpeg for email client compatibility
- Redesigned email template with HTML/CSS matching desktop bouquet display
- Implemented positioned flowers overlapping vase using flexbox and absolute positioning
- Added gradient backgrounds and responsive dark mode support using CSS media queries
- Implemented Gmail-only validation on controller with clear error messages
- Completely redesigned controller UI with cohesive visual style matching desktop interface
- Created gradient buttons for voice controls (green START, red STOP, blue PLAY)
- Refactored CSS using CSS variables for colors, fonts, shadows, and border-radius
- Created bash script (`setup.sh`) to auto-detect IP, regenerate SSL certificates, and start server
- Refined "Enable Audio" button with better positioning and styling
- Final testing confirmed complete workflow: QR pairing, flower selection, voice recording/playback, Gmail validation, email delivery with embedded images and MP3 attachments, synchronized "Delivered!" confirmation screens

---

## 🤖 AI Reflection

### Week 1-2
**Used AI for:**
- Technical refinement of project idea
- Documentation formatting (Markdown)
- Weekly planning structure
- Visual asset generation (Cava AI)
- Client/server architecture research
- Debugging connection issues (incorrect URL, missing DOM updates)

### Week 3-4
**Used AI for:**
- SSL certificate configuration guidance
- WebRTC debugging (ICE candidates, STUN servers)
- Nodemailer version compatibility issues
- Environment variable configuration
- Git workflow (branch merging)

### Week 5
**AI helped significantly with:**
- **Email rendering issues:** Understanding Nodemailer's `cid:` (Content-ID) system for embedded images
- **CSS positioning challenges:** Email clients have limited CSS support - Claude suggested `position: relative` container with `position: absolute` for flowers/vase using specific `bottom` values and z-index layering
- **Audio conversion:** Explored CloudConvert API vs ffmpeg-static for WebM→MP3 conversion
- **Dark mode compatibility:** Implemented `@media (prefers-color-scheme: dark)` with `!important` flags
- **CSS architecture:** Refactored entire stylesheet with CSS variables for maintainability
- **Form validation:** Gmail regex validation pattern
- **Automation:** Bash script for auto-detecting IP and regenerating certificates
- **Visual assets:** Cava AI for flower illustrations and vase refinements

### Overall Impact
AI helped solve complex technical problems (email rendering, audio conversion, SSL automation, WebRTC debugging) that would have taken days of trial-and-error, allowing me to focus on design decisions and user experience instead. The biggest time-savers were the automated setup script and understanding email client CSS limitations early.

---

## License

This project was created for educational purposes as part of Creative Code coursework.

---

## Author

**Vittoria Romano**  
Creative Code – March 2026, Belgium

---

## Acknowledgments

- OpenSSL for SSL certificate generation
- Google STUN servers for WebRTC NAT traversal
- Anthropic Claude for debugging and architectural guidance
- Nodemailer community for email delivery solutions