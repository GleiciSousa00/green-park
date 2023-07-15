const multer = require('multer');
const path = require('path');
const os = require('os');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(os.tmpdir()));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });


module.exports = upload;
