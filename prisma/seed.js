const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create admin user (essential for accessing admin panel)
  const hashedPassword = await bcrypt.hash('#!nclude<Adm!n_123>', 12)
  
  await prisma.user.upsert({
    where: { email: 'abdullahmemon1502@gmail.com' },
    update: {},
    create: {
      email: 'abdullahmemon1502@gmail.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  })

  // Create default settings (required for the app to function)
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      primaryColor: 'teal',
      sessionDuration: 3600, // 1 hour default
    },
  })

  console.log('✅ Database initialized successfully!')
  console.log('📝 Admin credentials:')
  console.log('   Email: abdullahmemon1502@gmail.com')
  console.log('   Password: #!nclude<Adm!n_123>')
  console.log('')
  console.log('🚀 You can now add your data through the admin panel at /admin')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
