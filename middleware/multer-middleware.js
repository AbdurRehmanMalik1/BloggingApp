const multer = require("multer");
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const imagesPath = path.join(__dirname, '../public/images'); // Path to 'public/images'
        return cb(null, imagesPath);
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E5);
        return cb(null, uniquePrefix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


module.exports  = upload;