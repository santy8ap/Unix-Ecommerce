
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'santy8aposso@gmail.com' // Hardcoded from .env
    console.log(`Looking for user with email: ${email}`)

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        console.error('User not found! Please sign in first so the account exists.')
        return
    }

    console.log(`Found user: ${user.name} (${user.id}). Current role: ${user.role}`)

    const updated = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
    })

    console.log(`✅ User updated safely. New role: ${updated.role}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
