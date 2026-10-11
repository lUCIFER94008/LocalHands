import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Validates image content using binary magic numbers (file header signatures).
 * Supports JPEG, PNG, and WebP.
 */
function validateImageMagicNumbers(buffer) {
  if (!buffer || buffer.length < 12) {
    return false;
  }

  // JPEG / JPG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // WEBP: RIFF (bytes 0-3) ... WEBP (bytes 8-11)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  return null;
}

/**
 * Uploads a provider profile image buffer to Cloudinary.
 * Never writes temporary files to disk, ensuring compatibility with read-only filesystems like Vercel.
 *
 * @param {File} file - Web standard File/Blob object from FormData
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function saveProviderImage(file) {
  if (!file) {
    throw new Error('No image file provided');
  }

  // 1. Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image file size exceeds the 5MB limit. Please choose a smaller photo.');
  }

  // 2. Validate file extension
  const ext = path.extname(file.name || '').toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error('Unsupported image format. Only JPG, JPEG, PNG, and WEBP formats are allowed.');
  }

  // 3. Read array buffer and validate magic numbers
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const detectedMime = validateImageMagicNumbers(buffer);
  if (!detectedMime) {
    throw new Error('Invalid image file content. File must be a valid JPG, PNG, or WEBP image.');
  }

  // 4. Validate Cloudinary environment credentials
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary credentials are not configured. Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables.'
    );
  }

  // 5. Configure Cloudinary SDK
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  // 6. Upload image directly via buffer stream to Cloudinary
  const uniquePublicId = `provider-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'local-hands/providers',
        public_id: uniquePublicId,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error.message || error);
          return reject(
            new Error(
              error.message ? `Cloudinary upload failed: ${error.message}` : 'Cloudinary upload rejected the image.'
            )
          );
        }

        if (!result || !result.secure_url) {
          return reject(new Error('Failed to retrieve secure URL from Cloudinary upload.'));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}
