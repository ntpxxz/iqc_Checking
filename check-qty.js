const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking for 0.7 Quantities in InboundTasks ---');
    const tasks = await prisma.inboundTask.findMany({
        where: {
            planQty: 0.7
        }
    });

    console.log(`Found ${tasks.length} tasks with planQty = 0.7`);
    tasks.slice(0, 5).forEach(task => {
        console.log(`ID: ${task.id}, Invoice: ${task.invoiceNo}, Part: ${task.partNo}, Qty: ${task.planQty}`);
    });

    const allTasks = await prisma.inboundTask.findMany({
        take: 10
    });
    console.log('\n--- First 10 Tasks ---');
    allTasks.forEach(task => {
        console.log(`ID: ${task.id}, Qty: ${task.planQty}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
