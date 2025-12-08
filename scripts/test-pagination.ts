
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
// Mock credentials - ensure these exist in your seed data or create a temporary user
const TEST_USER = {
    username: 'admin',
    password: 'password123'
};

async function testPagination() {
    console.log('Testing Pagination and Protection...');

    // 1. Login to get token
    console.log('1. Logging in...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_USER)
    });

    if (!loginRes.ok) {
        console.error('Login failed! Ensure admin user exists.');
        const text = await loginRes.text();
        console.error(text);
        return;
    }

    const { token } = await loginRes.json() as any;
    console.log('Login successful. Token received.');

    // 2. Test Pagination (Limit 2)
    console.log('\n2. Testing GET /api/books?limit=2&page=1');
    const page1Res = await fetch(`${BASE_URL}/api/books?limit=2&page=1`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const page1Data = await page1Res.json() as any;

    if (page1Data.data.length <= 2 && page1Data.pagination) {
        console.log('✅ Page 1 limit 2 passed.');
        console.log(`Received ${page1Data.data.length} items. Total: ${page1Data.pagination.total}`);
    } else {
        console.error('❌ Page 1 limit failed.', page1Data.pagination);
    }

    // 3. Test Search (Debounce Logic Verification API-side)
    const searchTerm = 'a'; // Common letter to get results
    console.log(`\n3. Testing GET /api/books?search=${searchTerm}`);
    const searchRes = await fetch(`${BASE_URL}/api/books?search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const searchData = await searchRes.json() as any;

    if (searchData.pagination) {
        console.log('✅ Search query executed.');
        console.log(`Found ${searchData.pagination.total} items matching "${searchTerm}"`);
    } else {
        console.error('❌ Search query failed.');
    }

    // 4. Test Route Protection (Unauthorized)
    console.log('\n4. Testing Protected API without Token');
    const protectedRes = await fetch(`${BASE_URL}/api/books`, {
        method: 'POST', // POST requires auth, GET might be public depending on middleware
        body: JSON.stringify({})
    });

    if (protectedRes.status === 401) {
        console.log('✅ Unauthorized request correctly blocked (401).');
    } else {
        console.error(`❌ Protection check failed. Status: ${protectedRes.status}`);
    }

    console.log('\nDone.');
}

testPagination().catch(console.error);
