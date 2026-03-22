# WebRTC

##  Core Idea

**LoveYours** is a real-time collaborative web application that allows users to create and send personalized digital flower bouquets.

The phone acts as a **remote controller**, while the desktop acts as a **live display**. Both devices connect using **WebRTC peer-to-peer communication**, enabling low-latency real-time interaction.

Users can:

-  Add flowers in different colors  
-  Write a personalized message  
-  Record a voice message  
- Send the final bouquet via email  

The connection between devices is established using a **QR code pairing system**, making the setup simple and intuitive.

---

##  How It Works (Architecture Overview)

PLEASE LOOK AT MY DIARY https://www.figma.com/board/zS6EDmdmtjWqm5HzuJ4ACg/CC4-DIARY?node-id=0-1&t=rhjQLejusCXPl1Rd-1

LoveYours uses a hybrid architecture combining WebRTC and WebSockets.

#!/bin/bash
CURRENT_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
echo "🔍 IP: $CURRENT_IP"

openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj "/CN=172.30.97.12" -extensions EXT -config <( \
   printf "[dn]\nCN=172.30.97.12\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost,IP:172.30.97.12\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

echo "✅ Cert for 172.30.97.12"
npm start
###  WebRTC (Peer-to-Peer)

Used for:
- Real-time flower controls  
- Live text synchronization  
- Voice message transfer  

Once connected, the phone and desktop communicate **directly** using a WebRTC Data Channel.  
No server is involved in real-time interactions after the connection is established.

---

###  WebSocket (Signalling Layer Only)

Used for:
- Exchanging WebRTC offer/answer  
- Exchanging ICE candidates  
- Matching phone and desktop sessions  

WebSockets are used **only during the connection setup phase**.

---

### Node.js Backend

The backend server handles:
- Hosting static frontend files  
- WebSocket signalling  
- Email sending via SMTP using Nodemailer  

---

###  External Services

- SMTP Provider – Used to deliver bouquet emails  
- STUN Server – Used for NAT traversal during WebRTC connection setup  

---

## Technology Stack

### Frontend
- HTML5  
- CSS3  
- Vanilla JavaScript (ES6+)  
- WebRTC APIs  
- MediaRecorder API  
- Canvas API  
- QR code libraries  

### Backend
- Node.js  
- Express.js  
- ws (WebSocket library)  
- Nodemailer  




## ️ How To Run The Project Locally

### 1 Clone the Repository

```bash
git clone https://github.com/vitto140/WebRTC.git
cd WebRTC

### 2 Install Dependencies
npm install

### 3 Start the Server
npm start

 ```
--- 

##  Development Ideal Timeline 
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
- Voice message recording and playback
- Live text synchronization
- Email sending functionality

### Week 4
- Live text synchronization
- Polish animations and transitions
- Final testing and bug fixes

### Week 5
- Implement 1-2 bonus features
- Performance optimization
- Comprehensive README update
---

## What I followed from the Plan

### Week 1
- Project planning and research
- Created technical documentation and user flow diagrams
- Defined project concept: phone-controlled bouquet creator using WebRTC
- Set up initial project structure with Express server and static files

### Week 2
- Implemented WebSocket signalling server with Socket.io for peer discovery
- Established WebRTC peer-to-peer data channel communication
- Created QR code pairing system for seamless phone-desktop connection
- Built flower carousel on phone controller with real-time rendering on desktop
- Debugged ICE candidate exchange and connection state issues
- Successfully tested flower selection sending from phone to desktop display

### Week 3
- Designed and implemented complete UI for both phone controller and desktop display
- Integrated voice message recording using MediaRecorder API
- **Got stuck:** iOS Safari blocked microphone access due to HTTP security restrictions
- Configured HTTPS with self-signed SSL certificates (OpenSSL) for development
- Updated server to use conditional HTTPS/HTTP based on environment (dotenv)
- Successfully implemented voice recording, transmission via WebRTC, and automatic playback on desktop
- Added Nodemailer integration for email delivery functionality
- **Current issue:** Page no longer loads on phone after SSL certificate changes - debugging connection/certificate acceptance flow


### Week 4
This week focused on implementing voice messaging functionality and resolving critical mobile compatibility issues. The primary challenge was iOS Safari blocking microphone access on HTTP connections, which required configuring HTTPS using self-signed SSL certificates generated with OpenSSL (including both localhost and LAN IP 192.168.9.191 in the certificate SAN). The server was updated to conditionally use HTTPS in development via dotenv environment configuration and bound to 0.0.0.0 to accept network connections. Voice recording was implemented using the MediaRecorder API, with audio data encoded to base64 and transmitted over WebRTC Data Channels using a JSON message protocol to differentiate between flowers, voice data, and control commands. A significant browser security hurdle was overcome by adding an "Enable Audio" button that users must click before playback to satisfy autoplay policy requirements. Email delivery functionality was integrated using Nodemailer with Gmail SMTP, featuring a DONE button workflow that reveals an email form, sends the bouquet notification, and displays a confirmation page on both devices via WebRTC signaling. Additional debugging included regenerating certificates when the Mac's IP changed, resolving nodemailer version compatibility (downgrading from v8 to v6), fixing SMTP password formatting (removing spaces), improving WebRTC connection stability by adding multiple STUN servers, and managing Git workflow to merge divergent branches. The application now successfully pairs devices via QR code over HTTPS, allows flower selection and voice message recording on mobile, plays audio on desktop after user interaction, and sends email notifications with custom messages.

##  AI Reflection

- The first week I have used AI for the technical refinement of my idea. 
Ask it to write my idea in a clear way, and in the format in which it looks good on the read me file.
I have told it what I want to do and what I will use and do to use it(with links for the MD DOCUMENTATION) and Claude made it look pretty 
Moreover I asked it to create a Weekly Planning to help me keep everything in track.
I used Cava AI to start creating some illustrations for the overall style of the page. 
I have also used it for research on clients/ server who/what is suppose to be who and where should their code be, because I am slow at learning new things and I get confused sometimes.

- The second week I have used AI to debug because the connection was not working, once due to the incorrect const url, and my second big mistake was i forgot to .appendChild(flower);  in the setupDataChannel. These ware dumb mistakes that cost me a long time

- AI Reflection - Week 5
This week I relied heavily on AI for email template debugging and CSS architecture decisions. When the embedded flower images weren't displaying in Gmail, Claude helped me understand Nodemailer's cid: (Content-ID) system and how to properly reference embedded attachments in HTML emails. I struggled with positioning the flowers above the vase in the email - my initial CSS approach didn't work because email clients have limited CSS support. Claude suggested using position: relative on the container and position: absolute on both the flowers and vase with specific bottom values and z-index layering, which worked perfectly. For the WebM to MP3 conversion, I initially wanted to avoid installing ffmpeg, so Claude suggested using the CloudConvert API as an alternative, though we ended up using ffmpeg-static for simplicity. The dark mode email compatibility issue was something I discovered myself when testing - the background turned dark but the header stayed light. Claude provided the @media (prefers-color-scheme: dark) solution with !important flags to force colors. I used AI to refactor the entire CSS file with CSS variables, which made the code much cleaner and easier to understand. The Gmail validation regex was provided by Claude since I'm not confident with regular expressions. The biggest time-saver was the bash script for auto-detecting IP and regenerating certificates - I was manually doing this every time I switched networks and Claude suggested automating it completely. I also used Cava AI to generate final flower illustrations and refinements to the vase asset to match the overall aesthetic. Overall, AI helped me solve complex technical problems (email rendering, audio conversion, SSL automation) that would have taken days of trial-and-error, allowing me to focus on design decisions and user experience instead.







# 🌸 LoveYours – WebRTC

## 💡 Core Idea

**LoveYours** is a real-time collaborative web application that allows users to create and send personalized digital flower bouquets.

The phone acts as a **remote controller**, while the desktop acts as a **live display**. Both devices connect using **WebRTC peer-to-peer communication**, enabling low-latency, real-time interaction.

Users can:
- Add flowers in different colors  
- Write a personalized message  
- Record a voice message  
- Send the final bouquet via email  

Devices are paired through a **QR code system**, making the experience seamless and intuitive.

---

## 🏗️ Architecture Overview

📌 Full development diary:  
https://www.figma.com/board/zS6EDmdmtjWqm5HzuJ4ACg/CC4-DIARY?node-id=0-1&t=rhjQLejusCXPl1Rd-1

LoveYours uses a **hybrid architecture** combining WebRTC and WebSockets.

### 🔗 WebRTC (Peer-to-Peer)

Used for:
- Real-time flower controls  
- Live text synchronization  
- Voice message transfer  

Once connected, devices communicate **directly** via a WebRTC Data Channel.

---

### 🔌 WebSocket (Signaling Only)

Used for:
- Exchanging WebRTC offer/answer  
- Exchanging ICE candidates  
- Matching phone and desktop sessions  

Only used during the connection setup phase.

---

### 🖥️ Node.js Backend

Handles:
- Hosting static frontend files  
- WebSocket signalling  
- Email sending via SMTP using Nodemailer  

---

### 🌐 External Services

- SMTP Provider (Gmail)  
- STUN Server  

---

## 🧰 Technology Stack

### Frontend
- HTML5  
- CSS3  
- Vanilla JavaScript (ES6+)  
- WebRTC APIs  
- MediaRecorder API  
- Canvas API  
- QR code libraries  

### Backend
- Node.js  
- Express.js  
- Socket.io  
- Nodemailer (v6)  

---

## ⚙️ How To Run The Project Locally

### 📋 Prerequisites
- Node.js (v14 or higher)  
- Gmail account with 2FA enabled  
- Same WiFi network for desktop and mobile  

---


## Install Dependencies
npm install


Installs:

express
socket.io
nodemailer@6
dotenv
ffmpeg-static
fluent-ffmpeg

Generate SSL Certificate
Option A: Manual
ifconfig | grep "inet " | grep -v 127.0.0.1

openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=YOUR_IP_HERE' -extensions EXT -config <( \
   printf "[dn]\nCN=YOUR_IP_HERE\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost,IP:YOUR_IP_HERE\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

Option B: Automated
chmod +x setup.sh
./setup.sh


This:

Detects your IP
Generates SSL certificate
Starts the server


Start the Server
npm start


Expected output:

Server running on https://localhost:3000
📱 Phone: https://YOUR_IP:3000

6️⃣ Access the App
💻 Desktop
Go to: https://YOUR_IP:3000 (not localhost)
Accept SSL warning
QR code appears
📱 Phone
Scan QR code
Accept SSL warning
Controller loads

👉 Click "🔊 Enable Audio" on desktop (required for playback)

🔧 Troubleshooting

Site not reachable

Same WiFi network
Correct IP
Server running on 0.0.0.0

Voice not playing

Click "Enable Audio" on desktop

Email not sending

Check .env credentials
Remove spaces in password
Use Nodemailer v6
Gmail only

Phone not connecting after network change

Run:
./setup.sh

⚠️ Important Notes
HTTPS is required (iOS microphone restriction)
Use IP address (not localhost)
Gmail only supported
SSL must be regenerated when IP changes

📅 Development Timeline
Week 1
Planning & research
Technical documentation
User flow design
Week 2
WebRTC + QR pairing
Flower selection prototype
Data flow testing
Week 3
Full UI implementation
Voice recording
Email functionality
Week 4
Voice + mobile fixes
Animations & polish
Testing
Week 5
Bonus features
Performance optimization
README improvements
✅ What Was Achieved
Week 1–3 Highlights
WebRTC connection established
QR pairing system implemented
Voice recording + playback working over HTTPS
Email sending with Nodemailer
Solved iOS Safari microphone restriction
Week 4 Deep Dive
Implemented HTTPS with OpenSSL (LAN IP support)
Built WebRTC data protocol (flowers, voice, commands)
Solved autoplay restriction with user-triggered audio
Added Gmail SMTP email workflow
Fixed:
Nodemailer version issues
SMTP password formatting
ICE / STUN reliability
Git branch merging
🤖 AI Reflection
Week 1–2
Used AI for:
Idea refinement
Documentation formatting
Planning
Debugging (connection issues, missing DOM updates)
Week 5

AI helped significantly with:

Email rendering issues (Gmail + CID images)
CSS limitations in email clients
Audio conversion (WebM → MP3)
Dark mode compatibility
Regex validation
SSL automation script

Also used AI tools for:

Visual asset generation
UI consistency
🧠 Final Reflection

AI enabled solving complex problems (email rendering, SSL setup, WebRTC debugging) much faster, allowing more focus on UX and design decisions rather than trial-and-error debugging.