import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { name: 'Teknologi' },
            update: {},
            create: { name: 'Teknologi', description: 'Buku-buku tentang teknologi dan informatika' },
        }),
        prisma.category.upsert({
            where: { name: 'Komunikasi' },
            update: {},
            create: { name: 'Komunikasi', description: 'Buku-buku tentang komunikasi dan media' },
        }),
        prisma.category.upsert({
            where: { name: 'Hukum Islam' },
            update: {},
            create: { name: 'Hukum Islam', description: 'Buku-buku tentang hukum dan syariat Islam' },
        }),
        prisma.category.upsert({
            where: { name: 'Ilmu Sosial' },
            update: {},
            create: { name: 'Ilmu Sosial', description: 'Buku-buku tentang ilmu sosial dan humaniora' },
        }),
        prisma.category.upsert({
            where: { name: 'Ekonomi' },
            update: {},
            create: { name: 'Ekonomi', description: 'Buku-buku tentang ekonomi dan bisnis' },
        }),
        prisma.category.upsert({
            where: { name: 'Bahasa' },
            update: {},
            create: { name: 'Bahasa', description: 'Buku-buku tentang bahasa dan linguistik' },
        }),
        prisma.category.upsert({
            where: { name: 'Agama' },
            update: {},
            create: { name: 'Agama', description: 'Buku-buku tentang agama dan spiritualitas' },
        }),
        prisma.category.upsert({
            where: { name: 'Pendidikan' },
            update: {},
            create: { name: 'Pendidikan', description: 'Buku-buku tentang pendidikan dan pembelajaran' },
        }),
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Create roles
    const roles = await Promise.all([
        prisma.role.upsert({
            where: { name: 'Admin' },
            update: {},
            create: { name: 'Admin', description: 'Full access to all features' },
        }),
        prisma.role.upsert({
            where: { name: 'Editor' },
            update: {},
            create: { name: 'Editor', description: 'Can manage books and content' },
        }),
        prisma.role.upsert({
            where: { name: 'Viewer' },
            update: {},
            create: { name: 'Viewer', description: 'Read-only access' },
        }),
    ]);

    console.log(`✅ Created ${roles.length} roles`);

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            fullName: 'Administrator',
            password: hashedPassword,
            roleId: roles[0].id,
            status: 'active',
        },
    });

    console.log(`✅ Created admin user: ${adminUser.username}`);

    // Create sample books
    const teknoCategory = categories.find(c => c.name === 'Teknologi');
    const komCategory = categories.find(c => c.name === 'Komunikasi');
    const hukumCategory = categories.find(c => c.name === 'Hukum Islam');

    const books = await Promise.all([
        prisma.book.upsert({
            where: { isbn: '978-979-076-799-1' },
            update: {},
            create: {
                title: 'Sistem Informasi Manajemen Pendidikan',
                author: 'Dr. Dadang Suhairi, S.E., M.M',
                pages: 198,
                size: '16 x 24 cm',
                isbn: '978-979-076-799-1',
                price: 42000,
                edition: 'Ke-1. 2025',
                synopsis: 'Buku ini membahas tentang sistem informasi manajemen dalam konteks pendidikan modern.',
                image: '/img/book-cover-optimized.png',
                stock: 50,
                categoryId: teknoCategory!.id,
            },
        }),
        prisma.book.upsert({
            where: { isbn: '978-979-076-800-4' },
            update: {},
            create: {
                title: 'Komunikasi Organisasi',
                author: 'Dr. H. Yana Sutiana, M.Ag.',
                pages: 250,
                size: '16 x 24 cm',
                isbn: '978-979-076-800-4',
                price: 68000,
                edition: 'Ke-1. 2025',
                synopsis: 'Membahas teori dan praktik komunikasi dalam organisasi.',
                image: '/img/book-cover-optimized.png',
                stock: 35,
                categoryId: komCategory!.id,
            },
        }),
        prisma.book.upsert({
            where: { isbn: '978-979-076-801-1' },
            update: {},
            create: {
                title: 'Hukum Perkawinan Islam',
                author: 'Dr. Beni Ahmad Saebani, M.Si.',
                pages: 320,
                size: '16 x 24 cm',
                isbn: '978-979-076-801-1',
                price: 78000,
                edition: 'Ke-2. 2025',
                synopsis: 'Kajian mendalam tentang hukum perkawinan dalam Islam.',
                image: '/img/book-cover-optimized.png',
                stock: 42,
                categoryId: hukumCategory!.id,
            },
        }),
    ]);

    console.log(`✅ Created ${books.length} sample books`);

    console.log('🎉 Database seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
