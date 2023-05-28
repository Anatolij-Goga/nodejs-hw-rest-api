const Joi = require("joi");

const phoneRegexp = /^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/;
const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.name": "please enter a valid name",
    "any.required": "missing required name field",
  }),
  email: Joi.string().email().pattern(emailRegexp).required().messages({
    "string.email": "please enter a valid email",
    "any.required": "missing required email field",
  }),
  phone: Joi.string().pattern(phoneRegexp).required().messages({
    "string.pattern.base": "please enter a valid phone",
    "any.required": "missing required phone field",
  }),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = { userSchema, updateFavoriteSchema };
