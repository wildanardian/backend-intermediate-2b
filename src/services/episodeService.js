const prisma = require('../config/prisma');
const { httpError, parseId } = require('../middlewares/errorHandler');
const { findContent } = require('./contentService');

function requireString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw httpError(400, `${field} wajib diisi`);
  }
  return value.trim();
}

function requirePositiveInt(value, field) {
  if (!Number.isInteger(value) || value < 1) {
    throw httpError(400, `${field} harus berupa bilangan bulat positif`);
  }
  return value;
}

function optionalString(value, field) {
  return value === null ? null : requireString(value, field);
}

// Petakan body snake_case ke field Prisma. Hanya field yang dikirim yang divalidasi.
function buildEpisodeData(body) {
  const data = {};
  if (body.episode_number !== undefined) {
    data.episodeNumber = requirePositiveInt(body.episode_number, 'episode_number');
  }
  if (body.title !== undefined) {
    data.title = requireString(body.title, 'title');
  }
  if (body.video_url !== undefined) {
    data.videoUrl = requireString(body.video_url, 'video_url');
  }
  if (body.description !== undefined) {
    data.description = optionalString(body.description, 'description');
  }
  if (body.thumbnail_url !== undefined) {
    data.thumbnailUrl = optionalString(body.thumbnail_url, 'thumbnail_url');
  }
  if (body.duration !== undefined) {
    data.duration = body.duration === null ? null : requirePositiveInt(body.duration, 'duration');
  }
  return data;
}

async function ensureEpisodeNumberAvailable(contentId, episodeNumber, excludeId) {
  const existing = await prisma.episode.findUnique({
    where: { contentId_episodeNumber: { contentId, episodeNumber } },
  });
  if (existing && existing.id !== excludeId) {
    throw httpError(409, 'Nomor episode sudah ada untuk content ini');
  }
}

async function findEpisode(id) {
  const episode = await prisma.episode.findUnique({ where: { id: parseId(id) } });
  if (!episode) {
    throw httpError(404, 'Episode tidak ditemukan');
  }
  return episode;
}

async function getAll(contentId) {
  const content = await findContent(contentId);
  return prisma.episode.findMany({
    where: { contentId: content.id },
    orderBy: { episodeNumber: 'asc' },
  });
}

async function add(contentId, body = {}) {
  const content = await findContent(contentId);
  if (content.type !== 'series') {
    throw httpError(400, 'Episode hanya bisa ditambahkan ke content bertipe series');
  }

  const data = buildEpisodeData(body);
  for (const field of ['episode_number', 'title', 'video_url']) {
    if (body[field] === undefined) {
      throw httpError(400, `${field} wajib diisi`);
    }
  }
  await ensureEpisodeNumberAvailable(content.id, data.episodeNumber);

  return prisma.episode.create({ data: { ...data, contentId: content.id } });
}

async function update(id, body = {}) {
  const episode = await findEpisode(id);
  const data = buildEpisodeData(body);
  if (data.episodeNumber !== undefined) {
    await ensureEpisodeNumberAvailable(episode.contentId, data.episodeNumber, episode.id);
  }
  return prisma.episode.update({ where: { id: episode.id }, data });
}

async function remove(id) {
  const episode = await findEpisode(id);
  await prisma.episode.delete({ where: { id: episode.id } });
}

module.exports = { getAll, add, update, remove };
