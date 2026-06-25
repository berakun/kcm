// server/database/init.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function init() {
  console.log('[Init DB] Initializing database schema and seeding...');
  
  // Create connection configuration
  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    multipleStatements: true // Allow executing entire schema.sql
  };

  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('[Init DB] Connected to MySQL server.');

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Run schema
    console.log('[Init DB] Running schema.sql...');
    await connection.query(schemaSql);
    console.log('[Init DB] Database schema created/verified successfully.');
    await connection.end();

    // Now run seeder
    const seed = require('./seed');
    await seed();
    
    console.log('[Init DB] Database initialized and seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Init DB] ERROR during initialization:', err);
    if (connection) {
      try {
        await connection.end();
      } catch (e) {}
    }
    process.exit(1);
  }
}

init();
