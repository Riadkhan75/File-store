/**
 * Image compression and optimization utilities for cloud storage safety.
 * Prevents Firestore document limit errors (1,048,576 bytes max) by resizing
 * and compressing uploaded images client-side.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/webp' | 'image/jpeg' | 'image/png';
}

/**
 * Compresses an image File or Blob using HTML5 Canvas.
 * Outputs an optimized base64 data URL typically between 15KB and 45KB.
 */
export async function compressImageFile(
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 320,
    maxHeight = 320,
    quality = 0.82,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file.'));

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        return reject(new Error('Empty file content.'));
      }

      compressBase64Image(dataUrl, { maxWidth, maxHeight, quality, mimeType })
        .then(resolve)
        .catch(reject);
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Resizes and compresses an existing base64 image data URL.
 */
export async function compressBase64Image(
  dataUrl: string,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 320,
    maxHeight = 320,
    quality = 0.82,
    mimeType = 'image/jpeg',
  } = options;

  // If it's not a data URL (e.g. an HTTP link), return as-is
  if (!dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onerror = () => {
      reject(new Error('Failed to load image for compression.'));
    };

    img.onload = () => {
      let targetWidth = img.width;
      let targetHeight = img.height;

      // Scale down proportionally to fit bounding box
      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
        targetWidth = Math.max(1, Math.round(targetWidth * ratio));
        targetHeight = Math.max(1, Math.round(targetHeight * ratio));
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Canvas 2D context unavailable.'));
      }

      // Smooth rendering for high-quality downsampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // For JPEG, fill background with transparent or neutral if needed
      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#08080a';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      try {
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        resolve(compressedDataUrl);
      } catch (err) {
        // Fallback to basic png if mimeType unsupported
        try {
          resolve(canvas.toDataURL('image/png'));
        } catch (innerErr) {
          reject(innerErr);
        }
      }
    };

    img.src = dataUrl;
  });
}

/**
 * Estimates the byte size of a JavaScript object when serialized as JSON.
 */
export function estimateJsonByteSize(obj: unknown): number {
  try {
    const str = JSON.stringify(obj);
    return new Blob([str]).size;
  } catch {
    return 0;
  }
}
