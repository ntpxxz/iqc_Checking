const { Pool } = require('pg');
require('dotenv').config();

async function simulateInvoice() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const testInvoice = {
        invoice: 'INV-TEST-' + Date.now(),
        partNo: 'TEST-PART-001',
        partName: 'Test Component',
        qty: 500,
        vendor: 'Test Supplier Co.',
        recordedBy: 'OneInv System',
        receivedDate: new Date().toISOString().split('T')[0],
        iqcstatus: 'Pending',
        po: 'PO-' + Math.floor(Math.random() * 10000)
    };

    try {
        const res = await pool.query(`
            INSERT INTO invoices (invoice, "partNo", "partName", qty, vendor, "recordedBy", "receivedDate", iqcstatus, po, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
            RETURNING id
        `, [
            testInvoice.invoice,
            testInvoice.partNo,
            testInvoice.partName,
            testInvoice.qty,
            testInvoice.vendor,
            testInvoice.recordedBy,
            testInvoice.receivedDate,
            testInvoice.iqcstatus,
            testInvoice.po
        ]);

        console.log('Successfully inserted test invoice. ID:', res.rows[0].id);
        console.log('Invoice Number:', testInvoice.invoice);
        console.log('Wait for 30 seconds or refresh the IQC Dashboard to see the notification.');

    } catch (err) {
        console.error('Error inserting test invoice:', err);
    } finally {
        await pool.end();
    }
}

simulateInvoice();
