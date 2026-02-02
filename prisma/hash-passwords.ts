import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Hashing passwords for all users...')

    const users = await prisma.user.findMany()
    console.log(`Found ${users.length} users.`)

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('password123', salt)

    for (const user of users) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword
            }
        })
        console.log(`✅ Updated password for user: ${user.username}`)
    }

    console.log('🎉 All passwords have been reset to "password123" (hashed).')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
