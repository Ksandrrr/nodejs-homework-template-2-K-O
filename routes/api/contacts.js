const express = require('express')
const controllersContacts = require("../../controllers/contacts")
const router = express.Router()
const schemas = require("../../schemas/contacts");
const validateBody = require("../../utils/validateBody")
router.get('/', controllersContacts.listContacts)

router.get('/:contactId', controllersContacts.getContactById)

router.post('/', validateBody(schemas.contactAddSchema), controllersContacts.addContact)

router.put('/:contactId', validateBody(schemas.contactAddSchema), controllersContacts.updateContactById)

router.delete('/:contactId', controllersContacts.removeContact)


module.exports = router
