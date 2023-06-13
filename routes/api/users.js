const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  resendVerifyEmail,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
} = require("../../controllers/users");
const { validateBody, authenticate, upload } = require("../../middlewares");
const {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
} = require("../../models/userJoi");

router.post("/register", validateBody(registerSchema), register);

router.get("/verify/:verificationToken", verifyEmail);

router.post("/verify", validateBody(verifyEmailSchema), resendVerifyEmail);

router.post("/login", validateBody(loginSchema), login);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logout);

router.patch("/", authenticate, updateSubscription);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
