const { supabaseAdmin } = require('./supabase');

/**
 * Upload file to Supabase Storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name with extension
 * @param {string} bucket - Storage bucket name (default: 'images')
 * @returns {Promise<{url: string, path: string}>}
 */
async function uploadFile(fileBuffer, fileName, bucket = 'images') {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;
    const filePath = `uploads/${uniqueFileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Delete file from Supabase Storage
 * @param {string} filePath - File path in storage
 * @param {string} bucket - Storage bucket name
 */
async function deleteFile(filePath, bucket = 'images') {
  try {
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * Upload multiple files
 * @param {Array<{buffer: Buffer, name: string}>} files
 * @param {string} bucket
 */
async function uploadMultipleFiles(files, bucket = 'images') {
  const uploadPromises = files.map(file => 
    uploadFile(file.buffer, file.name, bucket)
  );
  
  return Promise.all(uploadPromises);
}

module.exports = {
  uploadFile,
  deleteFile,
  uploadMultipleFiles
};
