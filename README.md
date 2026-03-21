# 🌌 ChatTalk - The Ultimate Real-time Messaging Ecosystem

Welcome to **ChatTalk**! This is a powerful, high-performance MERN-stack (MongoDB, Express, React, Node.js) application designed to provide a seamless, modern, and highly interactive chat experience. Leveraging an event-driven architecture with Socket.io, ChatTalk achieves true real-time synchronization.

---

## ✨ Key Features

- **Real-Time Messaging**: Instant message delivery with WebSocket architecture (Socket.io).
- **Group Chats & 1-on-1**: Create private conversations or extensive groups with multiple members.
- **Rich Media Sharing**: Native attachment support for images and documents powered by Cloudinary.
- **Live User Feedback**: Features live typing indicators (`...is typing`) and real-time read receipts (sent/delivered/seen).
- **Advanced Security**: Cross-domain stable authentication using JSON Web Tokens (JWT) stored in HTTP-only cookies, combined with Bcrypt password hashing.
- **Interactive UI**: Responsive frontend built with React, Material UI, and Framer Motion for buttery-smooth animations.
- **Robust Admin Dashboard**: A dedicated portal to manage the platform, users, and conversations.

---

## 🛡️ Admin Dashboard (Evaluation Highlight)

One of the standout features of ChatTalk is the fully functional **Admin Dashboard**. This secure area is designed for platform operators to monitor and govern the application.

**Features of the Admin Dashboard:**
- **Visual Analytics**: Interactive charts (via Chart.js) mapping active users, total messages, and chat distribution.
- **User Management**: View all registered users, their avatars, and activity status. Filter and moderate accounts if necessary.
- **Chat Monitoring**: Inspect active groups and 1-on-1 sessions occurring across the platform.
- **Message Oversight**: Track total messages exchanged to gauge platform engagement.

*Note for Evaluators: To access the Admin Dashboard, log in using the designated administrative credentials, or navigate to `/admin` to view the protected admin login route.*

---

## 🚀 Quick Start Guide (For Evaluators)

To test and run this project locally, please follow these steps carefully in two separate terminal windows.

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A running instance of MongoDB (Local or Atlas URI).
- A Cloudinary account for media uploads.

### Step 1: Backend Setup
1. Open a terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install the required Node dependencies:
   ```bash
   npm install
   ```
3. **Environment Variables**: Create a `.env` file in the `server` directory (you can copy `.env.example`).
   - Fill in your `MONGO_URI`.
   - Fill in your `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
   - Set a strong `JWT_SECRET` and `ADMIN_SECRET_KEY`.
4. Start the Node.js server:
   ```bash
   npm start
   ```
   *The backend will typically run on `http://localhost:3000`.*

### Step 2: Frontend Setup
1. Open a second terminal window and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install the React dependencies:
   ```bash
   npm install
   ```
3. **Environment Variables**: Ensure your `client/.env` file exists and points correctly to the server API URL (e.g., `VITE_SERVER=http://localhost:3000`).
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Visit the link provided in the terminal (usually `http://localhost:5173`) to view and interact with the application.

---

## 🏗 High-Level Architecture

ChatTalk operates as a **Unified Real-time System**:
1. **Frontend (Client)**: A React-based SPA that manages active UI state, real-time socket connection listeners, and reactive data fetching using Redux Toolkit (RTK) Query.
2. **Backend (Server)**: A Node.js/Express repository that securely handles persistent data operations (Mongoose), media uploads (Multer + Cloudinary), and HTTP route logic.
3. **Real-time Layer**: An interconnected WebSocket matrix that actively synchronizes payload delivery across the network with millisecond latency.

---

## 📁 Project Structure

- `client/`: Standalone React frontend environment.
  - `src/components/`: Reusable UI elements (shared, specific, layout).
  - `src/redux/`: Global state, RTK Query API endpoints, and authentication reducers.
  - `src/pages/`: Main application views including Chat, Groups, Home, and Admin Panel.
- `server/`: Standalone Node.js backend environment.
  - `models/`: Mongoose Schemas (`User`, `Message`, `Chat`, `Request`).
  - `controllers/`: Core business logic executing distinct features.
  - `routes/`: Express endpoint routing.
  - `middlewares/`: Security barriers (auth checks, error handling, Multer).

---
*Designed and Engineered by Ankush Verma for seamless digital communication.*
