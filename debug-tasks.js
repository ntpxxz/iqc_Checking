const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://rootpg:123456@localhost:5432/warehouse?schema=public&sslmode=disable"
        }
    }
});

async function main() {
    const tasks = await prisma.task.findMany({
        take: 10,
        select: {
            id: true,
            type: true,
            docRefNo: true,
            partNoRef: true,
            planQty: true,
            status: true
        }
    });
    console.log(JSON.stringify(tasks, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
