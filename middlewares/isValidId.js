const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers");

const isValidId = (req, _, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    next(new HttpError(400, `${contactId} is not valid`));
  }

  next();
};

module.exports = isValidId;
