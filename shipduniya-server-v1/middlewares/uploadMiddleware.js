const multer = require("multer");

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage,   
     limits: {
    fieldSize: 25 * 1024 * 1024, // 25 MB per field
    fileSize: 10 * 1024 * 1024,  // 10 MB per file
    fields: 100,                  // number of non-file fields
    files: 5                     // number of files
  }
 });

module.exports = upload;
