const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mysql = require('mysql2/promise');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/profile_images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const dbConfig = {
    host: 'localhost',
    user: 'root',  // Update with your MySQL username
    password: '',  // Update with your MySQL password
    database: 'instagram'  // Update with your database name
};

async function downloadImage(url, filename) {
    try {
        const response = await axios({
            url,
            responseType: 'arraybuffer'
        });
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, response.data);
        return `/uploads/profile_images/${filename}`;
    } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
        return null;
    }
}

async function main() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.query('SELECT id, profile_image FROM instagram_profiles WHERE profile_image IS NOT NULL');
        
        for (const row of rows) {
            if (!row.profile_image) continue;
            
            const filename = `profile_${row.id}${path.extname(new URL(row.profile_image).pathname)}`;
            const newPath = await downloadImage(row.profile_image, filename);
            
            if (newPath) {
                await connection.query(
                    'UPDATE instagram_profiles SET profile_image = ? WHERE id = ?',
                    [newPath, row.id]
                );
                console.log(`Updated profile ${row.id} with new image path: ${newPath}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

main();