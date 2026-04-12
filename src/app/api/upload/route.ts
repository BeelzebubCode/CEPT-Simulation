import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

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

/**
 * Client-upload flow via @vercel/blob.
 * The browser calls this endpoint twice:
 *   1. To request a short-lived upload token  (handled by onBeforeGenerateToken)
 *   2. On completion notification              (handled by onUploadCompleted)
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload, multipart) => {
        // ── Auth: only admins may upload ──
        if (!(await isAdminRequest(request))) {
          throw new Error('Unauthorized');
        }

        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_SIZE,
          tokenPayload: clientPayload,        // forward any client metadata
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Optional: you could persist blob.url to the DB here.
        // For now we just let the client handle it via the returned URL.
        console.log('[blob] upload completed:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}