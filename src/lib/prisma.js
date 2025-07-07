import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

let prisma

if (process.env.NODE_ENV === 'production') {
  // Production: Use Data Proxy with connection pooling
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    log: ['error', 'warn'],
  })
} else {
  // Development: Use direct connection with global instance
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    })
  }
  prisma = globalForPrisma.prisma
}

export { prisma }
