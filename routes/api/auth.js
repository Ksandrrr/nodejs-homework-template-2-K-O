const express = require("express");

const authController = require("../../controllers/auth");

const authenticate = require("../../middlewares/authenticate")

const upload = require("../../middlewares/upload")

const validateBody = require("../../utils/validateBody")

const {schemas} = require("../../models/auth");

const router = express.Router();


router.post("/register", validateBody(schemas.userRegisterSchema), authController.register);


router.post("/login", validateBody(schemas.userLoginSchema), authController.login);

router.get("/current", authenticate, authController.getCurrent);

router.post("/logout", authenticate, authController.logout);

router.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatar);

module.exports = router;