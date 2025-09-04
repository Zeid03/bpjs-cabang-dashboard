const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { authRequired } = require('../middleware/auth');
const { uploadExcel } = require('../controllers/uploadController');

const router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (/\.xlsx?$/.test(file.originalname)) {
            cb(null, true);
        } else {
            cb(new Error('Hanya file .xlsx/.xls yang diperbolehkan'));
        }
    },
});

router.post('/excel', authRequired, upload.single('file'), uploadExcel);

module.exports = router;