import express from "express";
import {
  addMembers,
  deleteChat,
  clearMessages,
  getChatDetails,
  getMessages,
  getMychats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendAttachements,
  deleteMessage,
  editMessage,
  reactMessage,
  markAsRead,
  searchMessages,
} from "../controllers/chat.js";
import {
  addMemberValidator,
  chatIdValidator,
  newGroupValidator,
  removeMemberValidator,
  renameValidator,
  sendAttachmentsValidator,
  validateHandler,
} from "../lib/validators.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const router = express.Router({ mergeParams: true });

// logged in user only :
router.use(isAuthenticated);

router.post("/new", newGroupValidator(), validateHandler, newGroupChat);

router.get("/my", getMychats);

router.get("/my/groups", getMyGroups);

router.put("/addmembers", addMemberValidator(), validateHandler, addMembers);

router.put(
  "/removemember",
  removeMemberValidator(),
  validateHandler,
  removeMember
);

router.delete("/leave/:id", chatIdValidator(), validateHandler, leaveGroup);

router.post(
  "/message",
  attachmentsMulter,
  sendAttachmentsValidator(),
  validateHandler,
  sendAttachements
);

router.get("/message/:id", chatIdValidator(), validateHandler, getMessages);

router
  .route("/:id")
  .get(chatIdValidator(), validateHandler, getChatDetails)
  .put(renameValidator(), validateHandler, renameGroup)
  .delete(chatIdValidator(), validateHandler, deleteChat);

router
  .route("/message/:id")
  .put(validateHandler, editMessage)
  .delete(validateHandler, deleteMessage);

router.put("/message/:id/react", validateHandler, reactMessage);

router.post("/markasread", markAsRead);
router.delete("/clear/:id", chatIdValidator(), validateHandler, clearMessages);
router.get("/search/:id", chatIdValidator(), validateHandler, searchMessages);

export default router;
