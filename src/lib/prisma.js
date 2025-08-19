import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

let prisma


if (process.env.NODE_ENV === 'production') {
  // Production: Use new env variable names
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.Database_URL_PRISMA_DATABASE_URL || process.env.Database_URL_DATABASE_URL || process.env.Database_URL_POSTGRES_URL
      }
    },
    log: ['error', 'warn'],
  })
} else {
  // Development: Use new env variable names with global instance
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.Database_URL_PRISMA_DATABASE_URL || process.env.Database_URL_DATABASE_URL || process.env.Database_URL_POSTGRES_URL
        }
      },
      log: ['query', 'error', 'warn'],
    })
  }
  prisma = globalForPrisma.prisma
}

export { prisma }
