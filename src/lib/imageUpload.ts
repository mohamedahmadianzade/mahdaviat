import { supabase, IMAGES_BUCKET } from './supabaseClient';

/**
 * Compress an image File to a JPEG Blob with max dimension and quality.
 * Keeps uploads small — a 5MB phone photo becomes ~100-200KB.
 */
async function compressImage(file: File, maxDim = 800, quality = 0.7): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(bitmap, 0, 0, w, h);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Compression failed'))),
      'image/jpeg',
      quality,
    );
  });
  bitmap.close?.();
  return blob;
}

function randomName(ext: string): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
}

/**
 * Upload an image to the images bucket after compressing it.
 * Returns the public URL of the uploaded file.
 * Throws if the compressed file exceeds maxUploadBytes.
 */
export async function uploadImage(file: File, folder = 'misc'): Promise<string> {
  const maxUploadBytes = 1_500_000; // 1.5 MB hard cap after compression
  const blob = await compressImage(file);
  if (blob.size > maxUploadBytes) {
    throw new Error(`تصویر بسیار حجیم است (${(blob.size / 1024).toFixed(0)}KB). لطفاً تصویر کوچک‌تری انتخاب کنید.`);
  }

  const path = `${folder}/${randomName('jpg')}`;
  const { error } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(path, blob, { contentType: 'image/jpeg', upsert: false });

  if (error) throw new Error(`خطا در آپلود تصویر: ${error.message}`);

  const { data } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Delete an image from the bucket by its public URL path.
 * Best-effort — does not throw if deletion fails (e.g., URL is external).
 */
export async function deleteImage(publicUrl: string): Promise<void> {
  try {
    if (!publicUrl) return;
    const url = new URL(publicUrl);
    const idx = url.pathname.indexOf(`/${IMAGES_BUCKET}/`);
    if (idx === -1) return;
    const filePath = url.pathname.slice(idx + IMAGES_BUCKET.length + 2);
    if (!filePath) return;
    await supabase.storage.from(IMAGES_BUCKET).remove([filePath]);
  } catch {
    // ignore — may be an external URL
  }
}
