import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Allowed image signatures (magic bytes)
const IMAGE_SIGNATURES: { bytes: number[]; ext: string }[] = [
  { bytes: [0xff, 0xd8, 0xff],                   ext: 'jpg' },
  { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a], ext: 'png' },
  { bytes: [0x47, 0x49, 0x46, 0x38],              ext: 'gif' },
  { bytes: [0x52, 0x49, 0x46, 0x46],              ext: 'webp' },
];

function detectImageType(buf: Uint8Array): string | null {
  for (const sig of IMAGE_SIGNATURES) {
    if (sig.bytes.every((b, i) => buf[i] === b)) {
      if (sig.ext === 'webp') {
        const marker = [0x57, 0x45, 0x42, 0x50];
        if (!marker.every((b, i) => buf[8 + i] === b)) continue;
      }
      return sig.ext;
    }
  }
  return null;
}

/**
 * Direct upload — receives FormData with a "file" field,
 * validates it, and returns a base64 data URL.
 * Works on Vercel (no filesystem needed) and locally.
 */
export async function POST(request: Request): Promise<NextResponse> {
  // Auth check
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 },
      );
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum: ${MAX_SIZE / 1024 / 1024}MB` },
        { status: 400 },
      );
    }

    // Read bytes & validate magic bytes
    const buffer = new Uint8Array(await file.arrayBuffer());
    const detectedType = detectImageType(buffer);
    if (!detectedType) {
      return NextResponse.json(
        { error: 'File content does not match any supported image format' },
        { status: 400 },
      );
    }

    // Convert to base64 data URL
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url: dataUrl });
  } catch (error) {
    console.error('[upload] error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}