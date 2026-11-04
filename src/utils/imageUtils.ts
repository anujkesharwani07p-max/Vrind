/**
 * Utility to process, resize and compress user-uploaded image files (PNG, JPG, WEBP)
 * into lightweight base64 Data URLs safe for storage and fast display.
 */
export async function processImageFile(
  file: File,
  maxWidth = 1000,
  maxHeight = 750,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (PNG, JPG, or WEBP).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image format.'));
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not initialize canvas context.'));
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // If file is PNG with transparent background, use PNG or JPEG with background
        const outputFormat = file.type === 'image/png' ? 'image/jpeg' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputFormat, quality);
        resolve(dataUrl);
      };

      if (typeof reader.result === 'string') {
        img.src = reader.result;
      } else {
        reject(new Error('Invalid image result.'));
      }
    };

    reader.readAsDataURL(file);
  });
}
