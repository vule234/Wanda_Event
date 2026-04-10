const multer = require('multer');
const { uploadFile, uploadMultipleFiles, deleteFile } = require('../config/storage');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Chỉ chấp nhận file ảnh'), false);
    }
    cb(null, true);
  }
});

/**
 * Upload single image
 */
async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được tải lên'
      });
    }

    const result = await uploadFile(
      req.file.buffer,
      req.file.originalname,
      'images'
    );

    res.json({
      success: true,
      message: 'Tải ảnh lên thành công',
      data: result
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi tải ảnh lên'
    });
  }
}

/**
 * Upload multiple images
 */
async function uploadMultipleImages(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được tải lên'
      });
    }

    const files = req.files.map(file => ({
      buffer: file.buffer,
      name: file.originalname
    }));

    const results = await uploadMultipleFiles(files, 'images');

    res.json({
      success: true,
      message: `Tải lên ${results.length} ảnh thành công`,
      data: results
    });
  } catch (error) {
    console.error('Upload multiple error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tải ảnh lên'
    });
  }
}

/**
 * Delete image
 */
async function deleteImage(req, res) {
  try {
    const { path } = req.body;

    if (!path) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu đường dẫn file'
      });
    }

    await deleteFile(path, 'images');

    res.json({
      success: true,
      message: 'Xóa ảnh thành công'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa ảnh'
    });
  }
}

module.exports = {
  upload,
  uploadImage,
  uploadMultipleImages,
  deleteImage
};
