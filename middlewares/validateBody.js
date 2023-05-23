const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const creatingWrapper = (req, _, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      next(new HttpError(400, error.message));
    }
    next();
  };
  return creatingWrapper;
};

module.exports = validateBody;
