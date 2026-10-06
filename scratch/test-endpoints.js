require('dotenv').config({ path: '.env.local' });

async function testFullAuthMatrix() {
  const baseUrl = 'http://localhost:3000';
  console.log('--- Starting Admin Authentication Security Audit ---');

  // 1. Admin Login Test
  console.log('\n1. Testing Admin Login (admin@test.com)...');
  const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@test.com', password: '123456', role: 'admin' }),
  });
  const adminCookie = adminLoginRes.headers.get('set-cookie');
  const adminData = await adminLoginRes.json();
  console.log(`Status: ${adminLoginRes.status} | Success: ${adminData.success}`);
  console.log(`Role in DB: ${adminData.data?.user?.role} | Redirect Path: ${adminData.data?.redirectPath}`);
  console.log(`HTTP-Only Cookie Set: ${Boolean(adminCookie && adminCookie.includes('lh_auth_token'))}`);

  // 2. Admin API Authorization Test with Admin Cookie
  console.log('\n2. Testing /api/admin/stats with Admin Cookie...');
  const adminStatsRes = await fetch(`${baseUrl}/api/admin/stats`, {
    headers: { Cookie: adminCookie },
  });
  const adminStatsData = await adminStatsRes.json();
  console.log(`Status: ${adminStatsRes.status} | Success: ${adminStatsData.success}`);
  console.log(`Total Users: ${adminStatsData.data?.totalUsers} | Total Bookings: ${adminStatsData.data?.totalBookings}`);

  // 3. Customer Login Test
  console.log('\n3. Testing Customer Login (ramees@test.com)...');
  const custLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ramees@test.com', password: '123456', role: 'customer' }),
  });
  const custCookie = custLoginRes.headers.get('set-cookie');
  const custData = await custLoginRes.json();
  console.log(`Status: ${custLoginRes.status} | Role: ${custData.data?.user?.role} | Redirect: ${custData.data?.redirectPath}`);

  // 4. Role Escalation Test: Customer attempting to access Admin API
  console.log('\n4. Testing /api/admin/stats with Customer Cookie (Forbidden Test)...');
  const custAdminRes = await fetch(`${baseUrl}/api/admin/stats`, {
    headers: { Cookie: custCookie },
  });
  const custAdminData = await custAdminRes.json();
  console.log(`Status: ${custAdminRes.status} | Error Message: "${custAdminData.error?.message}"`);

  // 5. Unauthenticated Access Test to Admin API
  console.log('\n5. Testing /api/admin/stats without Cookie (Unauthorized Test)...');
  const unauthRes = await fetch(`${baseUrl}/api/admin/stats`);
  const unauthData = await unauthRes.json();
  console.log(`Status: ${unauthRes.status} | Error Message: "${unauthData.error?.message}"`);

  console.log('\n--- Admin Authentication Audit Complete ---');
}

testFullAuthMatrix();
