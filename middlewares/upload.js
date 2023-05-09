const multer = require("multer");
const path = require("path");

// const HttpError = require("../helpers/HttpError");

const tempDir = path.resolve("temp");

const multerConfig = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniquePrefix}_${file.originalname}`);
        // cb(null, file.originalname)
    }
});



const upload = multer({
    storage: multerConfig,
})

module.exports = upload;