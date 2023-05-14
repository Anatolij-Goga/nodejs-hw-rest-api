const express = require("express");
const router = express.Router();
const control = require("../../controllers/contacts");
const { validateBody } = require("../../middlewares");
const schemas = require("../../schemas/contacts");

router.get("/", control.listContacts);

router.get("/:contactId", control.getContactById);

router.post("/", validateBody(schemas.contactSchema), control.addContact);

router.delete("/:contactId", control.removeContact);

router.put(
  "/:contactId",
  validateBody(schemas.contactSchema),
  control.updateContact
);

module.exports = router;
