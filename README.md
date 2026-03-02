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

##  Development Timeline
### Week 1
- Project planning and research
- Technical documentation
- User flow design
### Week 2
- WebRTC connection with QR pairing
- Basic flower selection and rendering
- Console logging to prove data flow
### Week 3
### Week 4
### Week 5

---
##  AI Reflection

- The first week I have used AI for the technical refinement of my idea. 
Ask it to write my idea in a clear way, and in the format in which it looks good on the read me file.
I have told it what I want to do and what I will use and do to use it(with links for the MD DOCUMENTATION) and Claude made it look pretty 
Moreover I asked it to create a Weekly Planning to help me keep everything in track.
I used Cava AI to start creating some illustrations for the overall style of the page. 
I have also used it for research on clients/ server who/what is suppose to be who and where should their code be, because I am slow at learning new things and I get confused sometimes.

- The second week I have used AI to debug because the connection was not working, once due to the incorrect const url, and my second big mistake was i forgot to .appendChild(flower);  in the setupDataChannel. These ware dumb mistakes that cost me a long time

