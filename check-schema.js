const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.$queryRaw`SELECT * FROM users LIMIT 1`;
        if (users.length > 0) {
            console.log('Columns in users table:', Object.keys(users[0]));
        } else {
            console.log('No users found, cannot read columns.');
        }
    } catch (e) {
        console.error(e);
    }
}

main().finally(() => prisma.$disconnect());
