const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const { HttpError, controlWrapper } = require("../helpers");
const {
  User,
  subscriptionList,
  avatarManipulator,
} = require("../models/userMongoose");
const { registerSchema, loginSchema } = require("../models/userJoi");

const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    throw HttpError(400, (message = "Invalid field value"));
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    avatarURL,
  });

  res.status(201).json({
    email: newUser.email,
  });
};

const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
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

const updateSubscription = async (req, res) => {
  const { subscription } = req.body;
  const { _id: userId } = req.user;

  if (!subscription || !subscriptionList.includes(subscription)) {
    throw HttpError(401, "Invalid subscription value");
  }

  const updateUser = await User.findByIdAndUpdate(
    userId,
    { subscription },
    { new: true }
  );

  res.json({
    user: {
      email: updateUser.email,
      subscription: updateUser.subscription,
    },
  });
};

const updateAvatar = async (req, res) => {
  const { _id: userId } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const resultUpload = path.join(avatarsDir, originalname);
  await fs.rename(tempUpload, resultUpload);

  await avatarManipulator(resultUpload);

  const newFileName = `${userId}_${originalname}`;
  const avatarURL = path.join("avatars", newFileName);

  await User.findByIdAndUpdate(userId, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: controlWrapper(register),
  login: controlWrapper(login),
  getCurrent: controlWrapper(getCurrent),
  logout: controlWrapper(logout),
  updateSubscription: controlWrapper(updateSubscription),
  updateAvatar: controlWrapper(updateAvatar),
};
