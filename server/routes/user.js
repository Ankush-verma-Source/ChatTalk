import express from "express";
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
} from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler,
} from "../lib/validators.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/new",
  singleAvatar,
  registerValidator(),
  validateHandler,
  newUser
);
router.post("/login", loginValidator(), validateHandler, login);



// logged in user only :
router.use(isAuthenticated);

router.get("/me", getMyProfile);
router.post("/logout", logout);

router.get("/search", searchUser);


router.put(
  "/sendrequest",
  sendRequestValidator(),
  validateHandler,
  sendFriendRequest
);

router.put(
  "/acceptrequest",
  acceptRequestValidator(),
  validateHandler,
  acceptFriendRequest
);

router.get("/notifications", getMyNotifications);

router.get("/friends", getMyFriends);

export default router;
