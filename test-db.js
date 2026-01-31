const { Client } = require('pg');

async function testConnection(host) {
    const client = new Client({
        user: 'rootpg',
        host: host,
        database: 'warehouse',
        password: '123456',
        port: 5432,
    });

    try {
        console.log(`Testing connection to ${host}...`);
        await client.connect();
        console.log(`Successfully connected to ${host}`);
        const res = await client.query('SELECT current_database(), current_user');
        console.log('Result:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error(`Failed to connect to ${host}:`, err.message);
    }
}

async function main() {
    await testConnection('localhost');
    await testConnection('127.0.0.1');
    await testConnection('host.docker.internal');
    await testConnection('172.16.96.42');
}

main();
