
const HttpError = require("../helpers/HttpError");
const ctrlWrapper = require("../utils/ctrlWrapper")
const { Contact } = require("../models/contacts");

const listContacts = async (req, res) => {
  const result = await Contact.find({},"-createdAt -updatedAt");
  res.status(200).json(result);
};

const getContactById = async (req, res) => {
  const {_id: owner} = req.user;
   const {page = 1, limit = 20, favorite = false} = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({owner}, "", {skip, limit}).populate("owner").all("favorite", favorite);
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.status(200).json(result);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
 const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json({
    message: "contact deleted",
  });
};

const addContact = async (req, res) => {
   const {_id: owner} = req.user
  const result = await Contact.create({...req.body, owner});
    res.status(201).json(result);
}

const updateContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body,{new: true});
    if (!result) {
        throw HttpError(404, `Not found`);
  }
   if(JSON.stringify(req.body) === "{}") {
    throw HttpError(400, "missing fields")
  }
    res.json(result);
}

const updateStatusContact  = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
        throw HttpError(404, `Not Found`);
    }
    if(JSON.stringify(req.body) === "{}") {
    throw HttpError(400, "missing field favorite")
  }
    res.json(result);
}

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  removeContact: ctrlWrapper(removeContact),
  addContact: ctrlWrapper(addContact),
  updateContactById: ctrlWrapper(updateContactById),
  updateStatusContact: ctrlWrapper(updateStatusContact )
};
