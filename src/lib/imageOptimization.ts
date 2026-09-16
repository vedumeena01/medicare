/**
 * Client-Side Image Compression & Optimization Utility
 * Optimizes high-resolution laboratory scans, doctor prescriptions, and packaging images
 * before sending to multimodal AI APIs or storing in client-side vaults.
 */

export interface CompressionResult {
  base64: string;
  originalBytes: number;
  compressedBytes: number;
  sizeReductionPercent: number;
  width: number;
  height: number;
}

/**
 * Checks if a given MIME type or file extension corresponds to a compressible image.
 */
export function isImageMimeType(mimeTypeOrFileName: string): boolean {
  const lower = mimeTypeOrFileName.toLowerCase();
  return (
    lower.startsWith('image/') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.png') ||
    lower.endsWith('.webp')
  );
}

/**
 * Compresses an image Data URL / Base64 string using client-side HTML5 Canvas.
 * Resizes dimensions to stay within maxWidth / maxHeight and adjusts JPEG/WebP quality.
 */
export async function compressImageBase64(
  base64DataUrl: string,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<CompressionResult> {
  const originalBytes = Math.round((base64DataUrl.length * 3) / 4);

  // If running in SSR or headless environment without window/Image, return pass-through
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    return {
      base64: base64DataUrl,
      originalBytes,
      compressedBytes: originalBytes,
      sizeReductionPercent: 0,
      width: maxWidth,
      height: maxHeight,
    };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let { width, height } = img;

      // Calculate proportional constrained dimensions
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback if canvas context unavailable
        resolve({
          base64: base64DataUrl,
          originalBytes,
          compressedBytes: originalBytes,
          sizeReductionPercent: 0,
          width: img.width,
          height: img.height,
        });
        return;
      }

      // Smooth bicubic resampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Output as optimized JPEG or WebP
      const outputType = base64DataUrl.includes('image/png') ? 'image/png' : 'image/jpeg';
      const compressedDataUrl = canvas.toDataURL(outputType, quality);
      const compressedBytes = Math.round((compressedDataUrl.length * 3) / 4);

      const sizeReductionPercent =
        originalBytes > 0
          ? Math.max(0, Math.round(((originalBytes - compressedBytes) / originalBytes) * 100))
          : 0;

      resolve({
        base64: compressedDataUrl,
        originalBytes,
        compressedBytes,
        sizeReductionPercent,
        width,
        height,
      });
    };

    img.onerror = () => {
      // Fallback on decode failure
      resolve({
        base64: base64DataUrl,
        originalBytes,
        compressedBytes: originalBytes,
        sizeReductionPercent: 0,
        width: 0,
        height: 0,
      });
    };

    img.src = base64DataUrl;
  });
}

/**
 * Compresses an uploaded File object before sending over the wire.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<{ file: File; base64: string; sizeReductionPercent: number }> {
  if (!isImageMimeType(file.type || file.name)) {
    // Non-image files (e.g. PDF) are returned untouched
    const base64 = await fileToBase64(file);
    return { file, base64, sizeReductionPercent: 0 };
  }

  const rawBase64 = await fileToBase64(file);
  const result = await compressImageBase64(rawBase64, maxWidth, maxHeight, quality);

  // Convert compressed base64 back to Blob and File
  const byteString = atob(result.base64.split(',')[1] || '');
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: file.type || 'image/jpeg' });
  const compressedFile = new File([blob], file.name, { type: file.type || 'image/jpeg' });

  return {
    file: compressedFile,
    base64: result.base64,
    sizeReductionPercent: result.sizeReductionPercent,
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
