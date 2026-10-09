const MAX_FILE_SIZE = 1 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function loadImage(file: File): Promise<{
  image: HTMLImageElement;
  objectUrl: string;
}> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({
        image,
        objectUrl,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("We couldn't read that image."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("We couldn't process the image."));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

function createFile(blob: Blob): File {
  return new File([blob], "birthday.jpg", {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

export async function prepareBirthdayPhoto(file: File): Promise<File> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Please choose a JPG, PNG, or WebP image.");
  }

  const { image, objectUrl } = await loadImage(file);

  try {
    let width = image.naturalWidth;
    let height = image.naturalHeight;

    if (!width || !height) {
      throw new Error("We couldn't determine the image dimensions.");
    }

    if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
      const scale = Math.min(
        MAX_IMAGE_DIMENSION / width,
        MAX_IMAGE_DIMENSION / height,
      );

      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Your browser could not prepare the image.");
    }

    const qualities = [0.88, 0.8, 0.72, 0.65, 0.58, 0.5];

    for (const quality of qualities) {
      canvas.width = width;
      canvas.height = height;

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);

      context.drawImage(image, 0, 0, width, height);

      const blob = await canvasToBlob(canvas, quality);

      if (blob.size <= MAX_FILE_SIZE) {
        return createFile(blob);
      }
    }

    /*
     * If quality reduction alone wasn't enough,
     * progressively reduce the dimensions.
     */
    for (let attempt = 0; attempt < 3; attempt++) {
      width = Math.round(width * 0.8);
      height = Math.round(height * 0.8);

      canvas.width = width;
      canvas.height = height;

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);

      context.drawImage(image, 0, 0, width, height);

      const blob = await canvasToBlob(canvas, 0.7);

      if (blob.size <= MAX_FILE_SIZE) {
        return createFile(blob);
      }
    }

    throw new Error(
      "This image could not be optimized to 1 MB. Please choose a simpler photo.",
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
