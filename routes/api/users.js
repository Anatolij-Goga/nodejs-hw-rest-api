const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getCurrent,
  logout,
} = require("../../controllers/users");
const { validateBody, authenticate } = require("../../middlewares");
const { registerSchema, loginSchema } = require("../../models/userJoi");

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.get("/current", authenticate, getCurrent);
router.post("/logout", authenticate, logout);

module.exports = router;
