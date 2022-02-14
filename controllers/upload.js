const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') ){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({storage: storage, fileFilter: fileFilter});

//let upload = multer({ dest: './images'}); //not possible to specify the filename to save in images directory
//console.log(upload);

module.exports = upload.single('image');