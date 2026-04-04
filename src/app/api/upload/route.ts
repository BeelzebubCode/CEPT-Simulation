import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { isAdminRequest } from '@/lib/auth';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// Allowed image signatures (magic bytes)
const IMAGE_SIGNATURES: { bytes: number[]; ext: string }[] = [
  { bytes: [0xff, 0xd8, 0xff],                   ext: 'jpg' }, // JPEG
  { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a], ext: 'png' }, // PNG
  { bytes: [0x47, 0x49, 0x46, 0x38],              ext: 'gif' }, // GIF
  { bytes: [0x52, 0x49, 0x46, 0x46],              ext: 'webp' }, // WebP (RIFF header)
];

function detectImageType(buf: Uint8Array): string | null {
  for (const sig of IMAGE_SIGNATURES) {
    if (sig.bytes.every((b, i) => buf[i] === b)) {
      // Extra check for WebP: bytes 8-11 must be "WEBP"
      if (sig.ext === 'webp') {
        const marker = [0x57, 0x45, 0x42, 0x50];
        if (!marker.every((b, i) => buf[8 + i] === b)) continue;
      }
      return sig.ext;
    }
  }
  return null;
}

export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 413 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Validate file contents via magic bytes — ignore the client-supplied MIME type
  const ext = detectImageType(new Uint8Array(buffer));
  if (!ext) {
    return NextResponse.json({ error: 'Only JPEG, PNG, GIF, and WebP images are allowed' }, { status: 415 });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  // Sanitise filename: strip directory traversal, keep only safe chars, force correct extension
  const baseName = file.name
    .replace(/\.\./g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .replace(/\.[^.]+$/, '');        // strip original extension
  const filename = `${Date.now()}-${baseName || 'upload'}.${ext}`;
  const filepath = path.join(uploadDir, filename);

  // Confirm the resolved path stays inside uploadDir (path traversal guard)
  if (!filepath.startsWith(uploadDir + path.sep)) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  await writeFile(filepath, buffer);
  return NextResponse.json({ url: `/uploads/${filename}` });
}