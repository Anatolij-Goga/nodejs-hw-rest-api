const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { HttpError, controlWrapper } = require("../helpers");
const { User } = require("../models/userMongoose");
const { schemas } = require("../models/userJoi");
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { error } = schemas.registerSchema.validate(req.body);
  if (error) {
    throw HttpError(400, (message = "Invalid field value"));
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
  });

  res.status(201).json({
    email: newUser.email,
  });
};

const login = async (req, res) => {
  const { error } = schemas.loginSchema.validate(req.body);
  if (error) {
    throw HttpError(400, (message = "Invalid field value"));
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is invalid");
  }

  const payload = {
    id: user._id,
  };
  console.log(payload);
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "6d" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success",
  });
};

module.exports = {
  register: controlWrapper(register),
  login: controlWrapper(login),
  getCurrent: controlWrapper(getCurrent),
  logout: controlWrapper(logout),
};
