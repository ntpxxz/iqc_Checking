const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function checkTasks() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    try {
        await client.connect();
        const res = await client.query('SELECT COUNT(*) FROM tasks');
        console.log('Total tasks:', res.rows[0].count);

        const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'tasks'
    `);
        console.log('Columns in tasks table:');
        columns.rows.forEach(row => console.log(`${row.column_name}: ${row.data_type}`));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkTasks();
