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

