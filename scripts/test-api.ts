/**
 * Automated API Test Script
 * Tests all CRUD endpoints for Books, Users, Roles, and Categories
 * Run with: npx tsx scripts/test-api.ts
 */

const BASE_URL = 'http://localhost:3000';

interface TestResult {
    name: string;
    passed: boolean;
    error?: string;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
    try {
        await fn();
        results.push({ name, passed: true });
        console.log(`✅ ${name}`);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        results.push({ name, passed: false, error: message });
        console.log(`❌ ${name}: ${message}`);
    }
}

async function api<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return response.json();
}

async function runTests() {
    console.log('\n🧪 Starting API Tests...\n');

    // ============ CATEGORIES TESTS ============
    console.log('--- Categories API ---');

    let categoryId: number;

    await test('GET /api/categories - should return empty or seeded categories', async () => {
        const res = await api<{ data: unknown[] }>('/api/categories');
        if (!res.data || !Array.isArray(res.data)) {
            throw new Error('Expected data array');
        }
    });

    await test('POST /api/categories - should create a category', async () => {
        const res = await api<{ id: number; name: string }>('/api/categories', {
            method: 'POST',
            body: JSON.stringify({ name: 'Test Category', description: 'Test Description' }),
        });
        if (!res.id) throw new Error('Expected category with id');
        categoryId = res.id;
    });

    await test('GET /api/categories/:id - should return single category', async () => {
        const res = await api<{ id: number }>(`/api/categories/${categoryId}`);
        if (res.id !== categoryId) throw new Error('Wrong category returned');
    });

    await test('PUT /api/categories/:id - should update category', async () => {
        const res = await api<{ name: string }>(`/api/categories/${categoryId}`, {
            method: 'PUT',
            body: JSON.stringify({ name: 'Updated Category' }),
        });
        if (res.name !== 'Updated Category') throw new Error('Name not updated');
    });

    // ============ ROLES TESTS ============
    console.log('\n--- Roles API ---');

    let roleId: number;

    await test('GET /api/roles - should return roles', async () => {
        const res = await api<{ data: unknown[] }>('/api/roles');
        if (!res.data || !Array.isArray(res.data)) {
            throw new Error('Expected data array');
        }
    });

    await test('POST /api/roles - should create a role', async () => {
        const res = await api<{ id: number; name: string }>('/api/roles', {
            method: 'POST',
            body: JSON.stringify({ name: 'Test Role', description: 'Test Role Description' }),
        });
        if (!res.id) throw new Error('Expected role with id');
        roleId = res.id;
    });

    await test('GET /api/roles/:id - should return single role', async () => {
        const res = await api<{ id: number }>(`/api/roles/${roleId}`);
        if (res.id !== roleId) throw new Error('Wrong role returned');
    });

    await test('PUT /api/roles/:id - should update role', async () => {
        const res = await api<{ description: string }>(`/api/roles/${roleId}`, {
            method: 'PUT',
            body: JSON.stringify({ description: 'Updated Description' }),
        });
        if (res.description !== 'Updated Description') throw new Error('Description not updated');
    });

    // ============ BOOKS TESTS ============
    console.log('\n--- Books API ---');

    let bookId: number;

    await test('GET /api/books - should return books', async () => {
        const res = await api<{ data: unknown[] }>('/api/books');
        if (!res.data || !Array.isArray(res.data)) {
            throw new Error('Expected data array');
        }
    });

    await test('POST /api/books - should create a book', async () => {
        const res = await api<{ id: number }>('/api/books', {
            method: 'POST',
            body: JSON.stringify({
                title: 'Test Book',
                author: 'Test Author',
                pages: 200,
                size: '16 x 24 cm',
                isbn: `978-000-000-${Date.now()}`,
                price: 50000,
                edition: 'Ke-1. 2025',
                categoryId: categoryId,
            }),
        });
        if (!res.id) throw new Error('Expected book with id');
        bookId = res.id;
    });

    await test('GET /api/books/:id - should return single book', async () => {
        const res = await api<{ id: number }>(`/api/books/${bookId}`);
        if (res.id !== bookId) throw new Error('Wrong book returned');
    });

    await test('PUT /api/books/:id - should update book', async () => {
        const res = await api<{ title: string }>(`/api/books/${bookId}`, {
            method: 'PUT',
            body: JSON.stringify({ title: 'Updated Test Book' }),
        });
        if (res.title !== 'Updated Test Book') throw new Error('Title not updated');
    });

    await test('GET /api/books?search=Updated - should search books', async () => {
        const res = await api<{ data: { title: string }[] }>('/api/books?search=Updated');
        if (!res.data.some(b => b.title.includes('Updated'))) {
            throw new Error('Search did not return expected results');
        }
    });

    // ============ CLEANUP ============
    console.log('\n--- Cleanup ---');

    await test('DELETE /api/books/:id - should delete book', async () => {
        await api(`/api/books/${bookId}`, { method: 'DELETE' });
    });

    await test('DELETE /api/roles/:id - should delete role', async () => {
        await api(`/api/roles/${roleId}`, { method: 'DELETE' });
    });

    await test('DELETE /api/categories/:id - should delete category', async () => {
        await api(`/api/categories/${categoryId}`, { method: 'DELETE' });
    });

    // ============ SUMMARY ============
    console.log('\n========================================');
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

    if (failed > 0) {
        console.log('\nFailed tests:');
        results.filter(r => !r.passed).forEach(r => {
            console.log(`  ❌ ${r.name}: ${r.error}`);
        });
        process.exit(1);
    } else {
        console.log('\n🎉 All tests passed!');
    }
}

runTests().catch(console.error);
