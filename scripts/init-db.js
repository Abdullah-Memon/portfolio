const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    // Set default DATABASE_URL if not found
    const dbUrl = process.env.DATABASE_URL || 'file:./tmp/dev.db';
    console.log('📁 Using database URL:', dbUrl);
    
    if (dbUrl.startsWith('file:')) {
      const dbPath = dbUrl.replace('file:', '');
      const fullDbPath = path.resolve(dbPath);
      const dbDir = path.dirname(fullDbPath);
      
      // Ensure directory exists
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log(`✅ Created directory: ${dbDir}`);
      }
      
      // Create empty database file if it doesn't exist
      if (!fs.existsSync(fullDbPath)) {
        fs.writeFileSync(fullDbPath, '');
        console.log(`✅ Created database file: ${fullDbPath}`);
      }
    }
    
    const prisma = new PrismaClient();
    
    // Try to connect
    await prisma.$connect();
    
    // Test if tables exist
    try {
      await prisma.user.findFirst();
      console.log('✅ Database connection successful, tables exist');
    } catch (error) {
      console.log('⚠️  Database tables not found, creating schema...');
      
      // Try to push the schema
      try {
        const { execSync } = require('child_process');
        execSync('npx prisma db push --force-reset --accept-data-loss', { 
          stdio: 'inherit',
          timeout: 30000,
          env: { ...process.env, DATABASE_URL: dbUrl }
        });
        console.log('✅ Database schema created');
        
        // Try to run seed
        try {
          const seedPath = path.join(process.cwd(), 'prisma', 'seed.js');
          if (fs.existsSync(seedPath)) {
            execSync('npm run db:seed', { 
              stdio: 'inherit', 
              timeout: 30000,
              env: { ...process.env, DATABASE_URL: dbUrl }
            });
            console.log('✅ Database seeded');
          }
        } catch (seedError) {
          console.log('⚠️  Seeding skipped:', seedError.message);
        }
        
      } catch (schemaError) {
        console.log('⚠️  Schema creation failed (normal for Vercel build):', schemaError.message);
      }
    }
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.log('⚠️  Database initialization skipped (normal for Vercel build):', error.message);
    // Don't fail the build process
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
