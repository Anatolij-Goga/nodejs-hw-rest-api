const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const regexpPhone = /^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/;
const regexpEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: regexpEmail,
      required: true,
    },
    phone: {
      type: String,
      match: regexpPhone,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const userSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.name": "please enter a valid name",
    "any.required": "missing required name field",
  }),
  email: Joi.string().email().pattern(regexpEmail).required().messages({
    "string.email": "please enter a valid email",
    "any.required": "missing required email field",
  }),
  phone: Joi.string().pattern(regexpPhone).required().messages({
    "string.pattern.base": "please enter a valid phone",
    "any.required": "missing required phone field",
  }),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = {
  userSchema,
  updateFavoriteSchema,
};

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  schemas,
};
