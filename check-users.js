const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Current Users in Database ---');
    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            role: true
        }
    });
    console.table(users);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
