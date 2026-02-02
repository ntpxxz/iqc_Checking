import { PrismaClient, InboundStatus, OutboundStatus, Role, Department } from '@prisma/client'
import fs from 'fs'
import csv from 'csv-parser'
import path from 'path'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ... (existing code)

async function main() {
    console.log('🌱 Starting Seed Process...')

    // ==========================================
    // 1. สร้าง Users (Mock Data)
    // ==========================================
    console.log('👤 Seeding Users...')
    const users = [
        { username: 'admin', role: Role.ADMIN, section: Department.PLANNING },
        { username: 'iqc01', role: Role.USER, section: Department.IQC },
        { username: 'wh01', role: Role.USER, section: Department.WAREHOUSE },
        { username: 'prod01', role: Role.USER, section: Department.PRODUCTION },
        { username: 'purchasing01', role: Role.USER, section: Department.PURCHASING },
    ]

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('password123', salt)

    for (const u of users) {
        await prisma.user.upsert({
            where: { username: u.username },
            update: {
                password: hashedPassword // Update existing users to hashed password too
            },
            create: {
                username: u.username,
                password: hashedPassword,
                role: u.role,
                section: u.section,
                email: `${u.username}@example.com`
            }
        })
    }

    // ==========================================
    // 2. Import Inbound (INVINCOM.csv)
    // ==========================================
    console.log(`📥 Processing Inbound Data from ${FILE_INVINCOM}...`)
    const inboundRows = await readCSV(FILE_INVINCOM)
    let inboundCount = 0

    for (const [index, row] of inboundRows.entries()) {
        const invoiceNo = row['INV_NO']?.trim()
        const itemNo = row['ITEM_NO']?.trim()

        if (!invoiceNo || !itemNo) continue

        const vendorName = row['VENDOR_NAME']?.trim() || 'UNKNOWN'
        const poNo = row['PO_NO']?.trim()
        const qty = parseFloat(row['REPLY_QTY'] || '0')

        // 2.1 สร้าง Supplier (ถ้ามีรหัส VENDOR)
        if (row['VENDOR']) {
            await prisma.supplier.upsert({
                where: { code: row['VENDOR'].trim() },
                update: { name: vendorName },
                create: { code: row['VENDOR'].trim(), name: vendorName }
            })
        }

        // 2.2 สร้าง Master Part
        const part = await prisma.part.upsert({
            where: { partNo: itemNo },
            update: { name: row['ITEM_NAME'] },
            create: {
                partNo: itemNo,
                name: row['ITEM_NAME'],
                spec: row['SPEC'],
                unit: row['REPLY_UNIT'] || 'PCS'
            }
        })

        // 2.3 สร้าง Inbound Task
        const existingTask = await prisma.inboundTask.findUnique({
            where: {
                invoiceNo_partNo_vendor: {
                    invoiceNo: invoiceNo,
                    partNo: itemNo,
                    vendor: vendorName
                }
            }
        })

        if (!existingTask) {
            const newTag = generateTagID('IN', index)
            await prisma.inboundTask.create({
                data: {
                    status: InboundStatus.PENDING,
                    tagNo: newTag,
                    invoiceNo: invoiceNo,
                    poNo: poNo,
                    vendor: vendorName,
                    partNo: itemNo,
                    partName: row['ITEM_NAME'],
                    partId: part.id,
                    planQty: qty,
                    rev: row['AC'], // Just a placeholder for rev
                }
            })
            inboundCount++
        }
    }
    console.log(`   ✅ Imported ${inboundCount} Inbound Tasks`)

    // ==========================================
    // 3. Simulating Workflows
    // ==========================================
    console.log('🤖 Simulating Workflows (Generating Mock Data)...')

    // Scenario A: Warehouse Received
    const tasksToReceive = await prisma.inboundTask.findMany({
        where: { status: InboundStatus.PENDING },
        take: 10
    })

    for (const task of tasksToReceive) {
        await prisma.inboundTask.update({
            where: { id: task.id },
            data: {
                status: InboundStatus.IQC_WAITING,
                receivedBy: 'wh01',
                receivedAt: new Date(),
                receiverNote: 'Received in good condition'
            }
        })
    }
    console.log(`   👉 Simulated: Warehouse Received 10 Tasks`)

    // Scenario B: IQC Inspected & Passed
    const tasksForQC = await prisma.inboundTask.findMany({
        where: { status: InboundStatus.IQC_WAITING },
        take: 5
    })

    for (const task of tasksForQC) {
        // 1. Create Inspection Result
        await prisma.inspectionResult.create({
            data: {
                inboundTaskId: task.id,
                passedQty: task.planQty,
                failedQty: 0,
                judgment: 'PASS',
                inspector: 'iqc01',
                remark: 'All dimensions within spec'
            }
        })

        // 2. Update Task Status
        await prisma.inboundTask.update({
            where: { id: task.id },
            data: {
                status: InboundStatus.IQC_PASSED_WAITING_STOCK,
                assignedTo: (await prisma.user.findFirst({ where: { username: 'iqc01' } }))?.id,
                startedAt: new Date(),
                finishedAt: new Date(),
                actualQty: task.planQty
            }
        })
    }
    console.log(`   👉 Simulated: IQC Inspected & Passed 5 Tasks`)

    // Scenario C: Completed & Update Stock
    const tasksForStock = await prisma.inboundTask.findMany({
        where: { status: InboundStatus.IQC_PASSED_WAITING_STOCK },
        take: 3
    })

    for (const task of tasksForStock) {
        if (!task.partId) continue

        // 1. Mark as Completed
        await prisma.inboundTask.update({
            where: { id: task.id },
            data: {
                status: InboundStatus.COMPLETED,
                targetLocation: 'A-01-05'
            }
        })

        // 2. Update Stock
        await prisma.stock.upsert({
            where: {
                partId_location: {
                    partId: task.partId,
                    location: 'A-01-05'
                }
            },
            update: {
                quantity: { increment: task.planQty }
            },
            create: {
                partId: task.partId,
                location: 'A-01-05',
                quantity: task.planQty
            }
        })

        // 3. Movement record
        await prisma.movement.create({
            data: {
                partId: task.partId,
                type: 'IN',
                qty: task.planQty,
                docRef: task.invoiceNo
            }
        })
    }
    console.log(`   👉 Simulated: Stock Updated for 3 Tasks`)

    console.log('🚀 Seeding Completed!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })