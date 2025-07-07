// Test script to verify database connection
// Run with: node test-db-connection.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    
    // Test user table access
    const userCount = await prisma.user.count();
    console.log(`📊 Found ${userCount} users in database`);
    
    // Test if admin user exists
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });
    
    if (adminUser) {
      console.log(`👤 Admin user found: ${adminUser.email}`);
    } else {
      console.log('⚠️  No admin user found - you may need to create one');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    if (error.code === 'P6001') {
      console.error('💡 Tip: Make sure you\'re using the correct Prisma Data Proxy URL format: prisma://...');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
