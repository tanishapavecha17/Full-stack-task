const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'profiles');


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    
    const uniqueSuffix = `${req.user.id}-${Date.now()}`;
    const fileExtension = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${fileExtension}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    
    cb(new Error('Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.'), false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: fileFilter
});



const uploadProfileImageMiddleware = (req, res, next) => {
  const processUpload = upload.single('image');

  processUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File is too large. Max size is 5MB.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    
    
    next();
  });
};

module.exports = { uploadProfileImageMiddleware };