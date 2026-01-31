const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function checkStatus() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    try {
        await client.connect();
        const res = await client.query('SELECT status, COUNT(*) FROM tasks GROUP BY status');
        console.log('Task status counts:');
        res.rows.forEach(row => console.log(`${row.status}: ${row.count}`));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkStatus();
