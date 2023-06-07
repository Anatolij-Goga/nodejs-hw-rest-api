const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers");

const { SECRET_KEY } = process.env;
const { User } = require("../models/userMongoose");

const authenticate = async (req, _, next) => {
  const authError = new HttpError(401, "Not authorized");

  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(authError);
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      return next(authError);
    }

    req.user = user;
    next();
  } catch {
    next(authError);
  }
};

module.exports = authenticate;
