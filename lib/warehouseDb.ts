import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.WAREHOUSE_DB_URL,
});

export const warehouseDb = {
    query: (text: string, params?: any[]) => pool.query(text, params),
};
