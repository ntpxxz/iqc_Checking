const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function checkTables() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    try {
        await client.connect();
        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log('Tables in database:');
        res.rows.forEach(row => console.log(row.table_name));
    } catch (err) {
        console.error('Error connecting to database:', err);
    } finally {
        await client.end();
    }
}

checkTables();
