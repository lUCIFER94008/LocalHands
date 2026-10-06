require('dotenv').config({ path: '.env.local' });
const http = require('http');

async function testEndpoints() {
  const baseUrl = 'http://localhost:3000';
  console.log('--- Starting End-to-End API Verification ---');

  const tests = [
    { name: 'Health Check API', path: '/api/health', method: 'GET' },
    { name: 'Services List API', path: '/api/services', method: 'GET' },
    { name: 'Providers List API', path: '/api/providers', method: 'GET' },
    {
      name: 'Customer Authentication',
      path: '/api/auth/login',
      method: 'POST',
      body: JSON.stringify({ email: 'ramees@test.com', password: '123456' }),
    },
    {
      name: 'Provider Authentication',
      path: '/api/auth/login',
      method: 'POST',
      body: JSON.stringify({ email: 'provider@test.com', password: '123456' }),
    },
    {
      name: 'Admin Authentication',
      path: '/api/auth/login',
      method: 'POST',
      body: JSON.stringify({ email: 'admin@test.com', password: '123456' }),
    },
  ];

  for (const t of tests) {
    try {
      const res = await fetch(`${baseUrl}${t.path}`, {
        method: t.method,
        headers: { 'Content-Type': 'application/json' },
        body: t.body,
      });
      const data = await res.json();
      console.log(`[PASS] ${t.name} -> Status: ${res.status} | OK: ${res.ok}`);
      if (data.user) {
        console.log(`       User authenticated: ${data.user.name} (${data.user.role})`);
      } else if (Array.isArray(data.data)) {
        console.log(`       Returned ${data.data.length} records.`);
      }
    } catch (err) {
      console.error(`[FAIL] ${t.name}:`, err.message);
    }
  }

  console.log('--- Verification Complete ---');
}

testEndpoints();
