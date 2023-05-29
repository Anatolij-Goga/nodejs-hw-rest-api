const express = require("express");
const router = express.Router();
const {
  getContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");
const { validateBody, isValidId, authenticate } = require("../../middlewares");
const { userSchema, updateFavoriteSchema } = require("../../models/contactJoi");

router.use(authenticate);

router.get("/", getContacts);

router.get("/:contactId", isValidId, getContactById);

router.post("/", authenticate, validateBody(userSchema), addContact);

router.delete("/:contactId", isValidId, removeContact);

router.put("/:contactId", isValidId, validateBody(userSchema), updateContact);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  updateStatusContact
);

module.exports = router;
