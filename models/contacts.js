
const {Schema, model} = require("mongoose");
const Joi = require("joi");

const HttpError = require("../helpers/HttpError");

const contactSchema = new Schema({
    
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  
}, { versionKey: false });

const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": `"missing required name field"`
    }),
    email: Joi.string().required().messages({
        "any.required": `"missing required email field"`
    }),
    phone: Joi.string().required().messages({
        "any.required": `"missing required phone field"`
    }),
    favorite: Joi.boolean(),
})

const favoriteSchema =  Joi.object({
  favorite: Joi.boolean(),
})

contactSchema.post("save", HttpError);


const Contact = model("contact", contactSchema);

module.exports = {
    contactAddSchema,
  Contact,
    favoriteSchema
}