const fs = require("fs/promises");
const path = require("path");

const renameUploadFile = async (file, resultDir) => {
    const {path: tempUpload, filename} = file;
    const resultUpload = path.join(resultDir, filename);
    await fs.rename(tempUpload, resultUpload);
}

module.exports = renameUploadFile;