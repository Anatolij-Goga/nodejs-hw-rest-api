const express = require("express");
const router = express.Router();
const control = require("../../controllers/contacts");
const { validateBody, isValidId } = require("../../middlewares");
const { schemas } = require("../../models/contact");

router.get("/", control.listContacts);

router.get("/:contactId", isValidId, control.getContactById);

router.post("/", validateBody(schemas.userSchema), control.addContact);

router.delete("/:contactId", isValidId, control.removeContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.userSchema),
  control.updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  control.updateStatusContact
);

module.exports = router;
