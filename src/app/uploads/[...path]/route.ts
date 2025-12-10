import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Helper to determine MIME type
function getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.webp': return 'image/webp';
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.gif': return 'image/gif';
        case '.svg': return 'image/svg+xml';
        default: return 'application/octet-stream';
    }
}

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ path: string[] }> }
) {
    try {
        const params = await props.params;
        const filePath = path.join(process.cwd(), 'uploads', ...params.path);

        // Security check: ensure path is within uploads directory
        const uploadsRoot = path.join(process.cwd(), 'uploads');
        const resolvedPath = path.resolve(filePath);

        if (!resolvedPath.startsWith(uploadsRoot)) {
            return new NextResponse(null, { status: 403 });
        }

        if (!existsSync(filePath)) {
            return new NextResponse(null, { status: 404 });
        }

        const fileBuffer = await readFile(filePath);
        const mimeType = getMimeType(filePath);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            }
        });
    } catch (error) {
        console.error('Error serving file:', error);
        return new NextResponse(null, { status: 500 });
    }
}
