// Cloudinary configuration for browser-based uploads

// Cloud name for your Cloudinary account
const CLOUD_NAME = 'placement-portal'; // Replace with your actual cloud name

// Unsigned upload preset - create this in your Cloudinary dashboard
// Go to Settings > Upload > Upload presets > Add upload preset
// Set mode to 'Unsigned' and save
const UPLOAD_PRESET = 'resume_uploads'; // Replace with your upload preset name

/**
 * Uploads a file to Cloudinary directly from the browser
 * @param {File} file - The file object to upload
 * @param {string} folder - The folder path in Cloudinary where the file should be stored
 * @returns {Promise<{url: string, publicId: string}>} - The upload result with secure URL and public ID
 */
export const uploadToCloudinary = async (file, folder = 'resumes') => {
  return new Promise((resolve, reject) => {
    // Create a FormData object to prepare the file for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);
    
    // Add a timestamp and unique identifier to prevent caching issues
    formData.append('timestamp', Date.now() / 1000);
    formData.append('api_key', undefined); // Not needed for unsigned uploads

    // Use the Cloudinary upload API endpoint with your cloud name
    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Upload successful:', data);
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
          format: data.format,
          originalFilename: data.original_filename
        });
      })
      .catch(error => {
        console.error('Error uploading to Cloudinary:', error);
        reject(error);
      });
  });
};

/**
 * Instructions for setting up Cloudinary:
 * 
 * 1. Sign up for a free Cloudinary account at https://cloudinary.com/users/register/free
 * 2. Get your cloud name from the Dashboard
 * 3. Create an unsigned upload preset:
 *    - Go to Settings > Upload > Upload presets
 *    - Click "Add upload preset"
 *    - Set mode to "Unsigned"
 *    - Configure any other settings (like folder restrictions, transformations, etc.)
 *    - Save the preset and use its name as UPLOAD_PRESET above
 * 
 * Note: For production, consider implementing server-side authentication for more secure uploads
 */