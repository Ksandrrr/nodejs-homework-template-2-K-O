const {Schema, model} = require("mongoose");
const Joi = require("joi");

const handleMongooseError = require("../helpers/handleMongooseError");

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: { 
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: String

}, {versionKey: false});

userSchema.post("save", handleMongooseError);

const userRegisterSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

const userLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

const schemas = {
    userRegisterSchema,
    userLoginSchema,
};

const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
}