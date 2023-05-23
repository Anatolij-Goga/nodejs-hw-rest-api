const { HttpError, controlWrapper } = require("../helpers");
const { Contact } = require("../models/contact");

const listContacts = async (req, res) => {
  const result = await Contact.listContacts();
  res.status(200).json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.getContactById(contactId);

  if (!result) throw new HttpError(404, "Not found");
  res.status(200).json(result);
};

const addContact = async (req, res) => {
  const result = await Contact.addContact(req.body);
  res.status(201).json(result);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.removeContact(contactId);

  if (!result) throw new HttpError(404, "Not found");

  res.status(200).json({ message: "Contact deleted" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.updateContact(contactId, req.body);

  if (!result) throw new HttpError(404, "Not found");

  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!result) throw new HttpError(404, "Not found");

  res.status(200).json(result);
};

module.exports = {
  listContacts: controlWrapper(listContacts),
  getContactById: controlWrapper(getContactById),
  addContact: controlWrapper(addContact),
  removeContact: controlWrapper(removeContact),
  updateContact: controlWrapper(updateContact),
  updateStatusContact: controlWrapper(updateStatusContact),
};
