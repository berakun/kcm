const http = require('http');

// Helper to make POST request to login and get token
function login() {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      username: 'superadmin',
      password: 'password123'
    });

    const req = http.request({
      hostname: '127.0.0.1',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.token);
        } catch (e) {
          reject(new Error('Failed to parse login response: ' + data));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Helper to call get rekap API with token
function getRekap(token, userId, start, end) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 3000,
      path: `/api/attendance/rekap?user_id=${userId}&start=${start}&end=${end}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse rekap response: ' + data));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function run() {
  try {
    console.log('Logging in...');
    const token = await login();
    console.log('Token obtained successfully.');

    console.log('Fetching rekap for user_id = 2 (June 2026)...');
    const rekap = await getRekap(token, 2, '2026-06-01', '2026-06-30');
    console.log('June rekap count:', rekap.records ? rekap.records.length : 0);
    if (rekap.records && rekap.records.length > 0) {
      console.log('Sample record from API:', rekap.records[0]);
    }

    console.log('Fetching rekap for user_id = 2 (April 2026)...');
    const rekapApril = await getRekap(token, 2, '2026-04-01', '2026-04-30');
    console.log('April rekap count:', rekapApril.records ? rekapApril.records.length : 0);
  } catch (e) {
    console.error(e);
  }
}

run();
