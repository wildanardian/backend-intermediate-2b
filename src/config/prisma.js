const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('../../prisma/generated');

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
