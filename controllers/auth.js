const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { User } = require("../models/auth");
const path = require("path");
const ctrlWrapper = require("../utils/ctrlWrapper")
const jimp = require("jimp");
const HttpError = require("../helpers/HttpError");
const avatarsDir = path.resolve("public", "avatars");
const fs = require("fs/promises");

const { SECRET_KEY } = process.env;

const register = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email in use")
    }
    const newAvatar = gravatar.url(
        email,
        {
          s: 250,
          r: "pd",
          d: "retro",
        },
        true
      );
    
    const hashPassword = await bcrypt.hash(password, 10);
    // const avatarURL = gravatar.url(email);
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL: newAvatar});
    res.status(201).json({
        user: { email: newUser.email,
        subscription: newUser.subscription}
    })
}

const login = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password invalid"); 
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password invalid"); 
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
     await User.findByIdAndUpdate(user._id, { token })
    
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        
        }
    })
}

const getCurrent = async(req, res)=> {
   const {email, subscription} = req.user;

    res.json({
        email,
        subscription,
    })
}

const logout = async(req, res)=> {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.status(204).json({
        message: "Logout success"
    })
}


const updateAvatar = async (req, res) => {
  const { path: tmpUpload, filename } = req.file;
  const resultUpload = path.join(avatarsDir, filename);
  const image = await jimp.read(tmpUpload);
  await image.resize(250, 250, jimp.RESIZE_BEZIER);
  await image.writeAsync(tmpUpload);
  await fs.rename(tmpUpload, resultUpload);
  const avatar = path.join("avatars", filename);
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { avatarURL: avatar });

  res.json({
    avatarURL: avatar,
  });
};
module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}