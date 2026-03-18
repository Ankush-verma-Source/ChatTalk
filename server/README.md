# 🛡️ ChatTalk - Robust Backend Architecture

This is the high-performance, event-driven Node.js backend for ChatTalk. It is built to handle thousands of concurrent WebSocket connections while maintaining strict security and data integrity.

## 🏗 Backend Philosophy

-   **Event-Driven**: The system is designed around the concept of "Emissions". Every significant action triggers a socket event to keep all clients in sync.
-   **Secure by Design**: Uses JWT-based authentication with `httpOnly` cookies and strict socket-level authorization.
-   **Scalable Attachments**: Offloads heavy lifting (processing and storage) to Cloudinary, keeping the server lean.

---

## 🏢 Core Tech Stack

-   **Node.js & Express 5**: Modern server-side framework for high-performance REST APIs.
-   **Socket.io 4**: Robust, bidirectional, and event-based communication.
-   **MongoDB & Mongoose**: Flexible, schema-driven data persistence.
-   **Cloudinary**: Third-party media management.
-   **express-validator**: Strong request validation and security.


## 🛠 Features

-   **Event-Based Real-time Sync**: Uses a centralized `emitEvent` system to synchronize clients instantly.
-   **File Processing**: Integrated with `multer` to handle multi-part file uploads directly to Cloudinary.
-   **Seeders**: Pre-configured data generators using `@faker-js/faker` for rapid development testing.
-   **Error Handling**: Centralized `TryCatch` wrapper and `ErrorHandler` middleware for consistent API responses.
-   **Authentication Middleware**: Custom `isAuthenticated` middleware for route protection.
-   **Socket Authentication**: Specialized middleware to authenticate socket connections for secure WebSockets.

---

## 📁 Detailed Module Breakdown

### 🧩 `controllers/`
- **`user.js`**: Profile management, search logic, and friend request handling (Send/Accept/Reject).
- **`chat.js`**: Core conversation logic—creating chats (group/private), fetching messages, clearing history, and deleting conversations.
- **`admin.js`**: Specialized dashboard logic for monitoring application metrics.

### 🗄 `models/`
- **`User`**: Handles identity, password hashing (bcrypt), and metadata.
- **`Chat`**: Defines conversation type (group/private) and member lists.
- **`Message`**: Tracks content, senders, and Cloudinary-stored attachments.
- **`Request`**: Manages the lifecycle of friend requests.

### 🛰 `lib/` & `middlewares/`
- **`helper.js`**: Core utilities like `getSockets` (maps User IDs to active Socket IDs).
- **`auth.js`**: Multi-layered protection (HTTP routes vs Socket connections).
- **`multer.js`**: Configures multi-part/form-data for seamless file uploads.
- **`error.js`**: Centralized async error handling system.

---

## 📡 Socket Event Registry

| Event Name | Action | Direction |
| :--- | :--- | :--- |
| `NEW_MESSAGE` | New message arrives | Server ➡️ Client |
| `NEW_MESSAGE_ALERT` | Badge update for inactive chat | Server ➡️ Client |
| `NEW_REQUEST` | Incoming friend request | Server ➡️ Client |
| `START_TYPING` | User begins typing | Client ➡️ Server |
| `STOP_TYPING` | User stops typing | Client ➡️ Server |
| `CHAT_JOINED` | User enters chat view | Client ➡️ Server |
| `ONLINE_USERS` | Live availability list | Server ➡️ Client |


## 📦 Scripts

-   `npm start`: Start the production server with the basic Node.js command.
-   `npm run dev`: Start the server with `nodemon` for automatic restarts during development.

---
Built with ❤️ by Ankush Verma.
