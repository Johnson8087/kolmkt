const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'instagram_data',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        console.log('Connection config:', {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            database: process.env.DB_NAME || 'instagram_data'
        });
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
})();

module.exports = pool;