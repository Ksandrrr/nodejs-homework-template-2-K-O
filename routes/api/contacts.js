const express = require('express')
const controllersContacts = require("../../controllers/contacts")
const router = express.Router()
const schemas = require("../../models/contacts");
const validateBody = require("../../utils/validateBody")
const isValidId  = require("../../middlewares/isValideId")

router.get('/', controllersContacts.listContacts)

router.get('/:contactId',isValidId, controllersContacts.getContactById)

router.post('/', validateBody(schemas.contactAddSchema), controllersContacts.addContact)

router.put('/:contactId',isValidId, controllersContacts.updateContactById)

router.delete('/:contactId',isValidId, controllersContacts.removeContact)

router.patch('/:contactId/favorite',isValidId,validateBody(schemas.favoriteSchema), controllersContacts.updateStatusContact )

module.exports = router
