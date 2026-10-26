const prisma = require('../config/prisma');
const { httpError, parseId } = require('../middlewares/errorHandler');

async function getAll(userId) {
  return prisma.watchlist.findMany({
    where: { userId },
    orderBy: { addedAt: 'desc' },
    select: {
      id: true,
      addedAt: true,
      content: {
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          posterUrl: true,
          ageRating: true,
          releaseYear: true,
        },
      },
    },
  });
}

async function add(userId, body = {}) {
  const contentId = parseId(body.content_id, 'content_id tidak valid');

  const content = await prisma.content.findUnique({ where: { id: contentId } });
  if (!content) {
    throw httpError(404, 'Content tidak ditemukan');
  }

  const existing = await prisma.watchlist.findFirst({ where: { userId, contentId } });
  if (existing) {
    throw httpError(409, 'Content sudah ada di watchlist');
  }

  return prisma.watchlist.create({ data: { userId, contentId } });
}

async function remove(userId, contentIdParam) {
  const contentId = parseId(contentIdParam, 'content_id tidak valid');

  const item = await prisma.watchlist.findFirst({ where: { userId, contentId } });
  if (!item) {
    throw httpError(404, 'Content tidak ada di watchlist');
  }

  await prisma.watchlist.delete({ where: { id: item.id } });
}

module.exports = { getAll, add, remove };
