# 🛡️ ChatTalk - Robust Backend Architecture

Welcome to the **Server Integration** of ChatTalk. This is the high-performance, event-driven Node.js backend built specifically to handle concurrent WebSocket connections while enforcing strict security protocols and complex data integrity rules.

---

## 🏗 Backend Philosophy

- **Event-Driven Ecosystem**: The system revolves around the concept of "Emissions". Every significant mutation within the database synchronously triggers a targeted socket event to keep all connected clients perfectly in sync.
- **Impenetrable Security**: Adopts a zero-trust model using JSON Web Tokens (JWT) embedded within `httpOnly` secure cookies. It features robust cross-site environment support through **Partitioned Cookies (CHIPS)** and optimized **Trust Proxy** configurations tailored for environments like Safari and iOS.
- **Scalable Media Offloading**: Heavy lifting involving multimedia processing and storage is directly offloaded to Cloudinary, ensuring the Node.js event loop remains unblocked and incredibly fast.

---

## 🏢 Core Tech Stack

- **Node.js & Express**: Modern server-side orchestration framework tailored for high-throughput REST APIs and middleware pipelines.
- **Socket.io 4**: Facilitates the robust, bidirectional, and event-based WebSocket communication layer.
- **MongoDB & Mongoose**: Flexible, schema-driven NoSQL data persistence utilizing rigorous Object Data Modeling (ODM).
- **Cloudinary SDK**: Centralized media management and on-the-fly image transformations.
- **Bcrypt & Multer**: Core utilities for cryptographic password hashing and `multipart/form-data` stream parsing respectively.

---

## 📁 Detailed Module Breakdown

### 🗄 `models/` (Mongoose Schemas)
- **`User`**: Securely handles identity, executing pre-save `bcrypt` hooks for password hashing and metadata tracking.
- **`Chat`**: Defines contextual boundaries, gracefully distinguishing between multi-user groups and private 1-on-1 sessions.
- **`Message`**: Tracks conversational flow, caching senders, delivery statuses, reactions, and polymorphic Cloudinary-stored attachments.
- **`Request`**: Manages the complex, asynchronous lifecycle of friend connections (pending, accepted, rejected).

### 🧩 `controllers/`
- **`user.js`**: Executes profile management, complex search aggregations, and friend request state machines.
- **`chat.js`**: Core engine handling conversation instantiation, history fetches, and cascaded deletions.
- **`admin.js`**: Highly secure, specialized logic restricted to dashboard analytics detailing system-wide metrics.

### 🛰 `lib/` & `middlewares/`
- **`auth.js`**: Multi-layered authorization barriers distinguishing HTTP route protection and active Socket connection handshakes.
- **`multer.js`**: Streamlined buffers defining exact limits and multi-part parsing.
- **`error.js`**: A centralized, asynchronous error-handling trap utilizing `TryCatch` wrappers for completely uniform API responses.

---

## 📡 Socket Event Registry

The WebSocket layer strictly adheres to predefined communication protocols:

| Event Name | Action Trigger | Traffic Direction |
| :--- | :--- | :--- |
| `NEW_MESSAGE` | A new message document is inserted | Server ➡️ Client |
| `NEW_MESSAGE_ALERT` | Badge count update for inactive view | Server ➡️ Client |
| `NEW_REQUEST` | An incoming friend request is dispatched | Server ➡️ Client |
| `START_TYPING` | User begins input stream | Client ➡️ Server |
| `STOP_TYPING` | User halts input stream | Client ➡️ Server |
| `CHAT_JOINED` | Client successfully mounts a chat view | Client ➡️ Server |
| `ONLINE_USERS` | Live availability polling list | Server ➡️ Client |

---

## 🏁 Development Setup

### Environment Requirements
Create a `.env` file in the root of the `server/` directory:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster...
JWT_SECRET=your_super_secret_string
ADMIN_SECRET_KEY=your_admin_secret_string
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### CLI Commands
- `npm install`: Installs the required backend dependencies.
- `npm run dev`: Bootstraps the server via `nodemon` for active automatic restarts during development.
- `npm start`: Initializes the production-ready Node.js process.

---
*Backend architecture meticulously formulated by Ankush Verma.*
