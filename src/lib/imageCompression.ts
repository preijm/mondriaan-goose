// Automatic image compression utilities

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeBytes?: number;
  format?: 'jpeg' | 'webp' | 'png';
}

const DEFAULT_COMPRESSION_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
  maxSizeBytes: 2 * 1024 * 1024, // 2MB target
  format: 'jpeg'
};

export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const opts = { ...DEFAULT_COMPRESSION_OPTIONS, ...options };
  
  // If file is already small enough, return as-is
  if (file.size <= opts.maxSizeBytes) {
    console.log('File already within size limit, skipping compression');
    return file;
  }

  try {
    const image = await loadImageFromFile(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Calculate new dimensions while maintaining aspect ratio
    const { width, height } = calculateDimensions(
      image.naturalWidth,
      image.naturalHeight,
      opts.maxWidth,
      opts.maxHeight
    );

    canvas.width = width;
    canvas.height = height;

    // Draw and compress the image
    ctx.drawImage(image, 0, 0, width, height);

    // Start with the specified quality and reduce if needed
    let quality = opts.quality;
    let compressedFile: File;
    let attempts = 0;
    const maxAttempts = 5;

    do {
      const blob = await canvasToBlob(canvas, opts.format, quality);
      compressedFile = new File([blob], getCompressedFileName(file.name, opts.format), {
        type: blob.type,
        lastModified: Date.now(),
      });

      console.log(`Compression attempt ${attempts + 1}: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB (quality: ${quality})`);

      if (compressedFile.size <= opts.maxSizeBytes || attempts >= maxAttempts - 1) {
        break;
      }

      // Reduce quality for next attempt
      quality = Math.max(0.1, quality - 0.15);
      attempts++;
    } while (attempts < maxAttempts);

    // Clean up
    URL.revokeObjectURL(image.src);

    console.log(`Image compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
    return compressedFile;

  } catch (error) {
    console.error('Image compression failed:', error);
    // Return original file if compression fails
    return file;
  }
};

const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  let width = originalWidth;
  let height = originalHeight;

  // Calculate the scaling factor
  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;
  const scalingFactor = Math.min(widthRatio, heightRatio, 1); // Don't upscale

  width = Math.round(width * scalingFactor);
  height = Math.round(height * scalingFactor);

  return { width, height };
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  format: string,
  quality: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      `image/${format}`,
      quality
    );
  });
};

const getCompressedFileName = (originalName: string, format: string): string => {
  const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExtension}_compressed.${format}`;
};

// Helper function to check if compression is beneficial
export const shouldCompress = (file: File, maxSize: number = 2 * 1024 * 1024): boolean => {
  return file.size > maxSize && file.type.startsWith('image/');
};

// Progressive compression for very large files
export const progressiveCompress = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> => {
  if (!shouldCompress(file)) {
    return file;
  }

  onProgress?.(10);
  
  const compressedFile = await compressImage(file, {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.85,
    maxSizeBytes: 2 * 1024 * 1024,
    format: 'jpeg'
  });

  onProgress?.(100);
  return compressedFile;
};