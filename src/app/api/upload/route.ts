import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

// POST /api/upload - Upload and compress image
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'covers'; // Default to 'covers'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WebP allowed.' }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Maximum 5MB allowed.' }, { status: 400 });
        }

        // Sanitize folder name to prevent directory traversal
        const safeFolder = folder.replace(/[^a-zA-Z0-9-_]/g, '');

        // Use persistent uploads directory from environment, or default to project uploads
        const uploadsBaseDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
        const uploadDir = path.join(uploadsBaseDir, safeFolder);

        // Ensure upload directory exists
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Generate secure unique filename (no user input)
        const timestamp = Date.now();
        const randomId = crypto.randomUUID().slice(0, 8);
        const filename = `${timestamp}-${randomId}.webp`;
        const filepath = path.join(uploadDir, filename);

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Compress and convert to WebP using sharp
        await sharp(buffer)
            .resize(400, 600, { // A4-like aspect ratio
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 80 })
            .toFile(filepath);

        // Return public URL
        const publicUrl = `/uploads/${safeFolder}/${filename}`;

        return NextResponse.json({
            url: publicUrl,
            filename
        }, { status: 201 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
