const prisma = require('../config/prisma');
const { httpError, parseId } = require('../middlewares/errorHandler');

const CONTENT_TYPES = ['movie', 'series'];

const genresInclude = { genres: { select: { genre: true } } };

// Ubah content_genres menjadi array genre { id, name }
function withGenres(content) {
  return { ...content, genres: content.genres.map((item) => item.genre) };
}

function isEmpty(value) {
  return value === undefined || value === null;
}

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

// Petakan body snake_case ke field Prisma. Hanya field yang dikirim yang divalidasi.
function buildContentData(body) {
  const data = {};
  const stringFields = {
    title: 'title',
    slug: 'slug',
    synopsis: 'synopsis',
    poster_url: 'posterUrl',
    banner_url: 'bannerUrl',
    age_rating: 'ageRating',
  };

  for (const [key, field] of Object.entries(stringFields)) {
    if (body[key] !== undefined) {
      data[field] = requireString(body[key], key);
    }
  }
  if (body.type !== undefined) {
    if (!CONTENT_TYPES.includes(body.type)) {
      throw httpError(400, 'type harus movie atau series');
    }
    data.type = body.type;
  }
  if (body.release_year !== undefined) {
    data.releaseYear = requirePositiveInt(body.release_year, 'release_year');
  }
  if (body.is_trending !== undefined) {
    if (typeof body.is_trending !== 'boolean') {
      throw httpError(400, 'is_trending harus berupa boolean');
    }
    data.isTrending = body.is_trending;
  }
  if (body.video_url !== undefined) {
    data.videoUrl = isEmpty(body.video_url) ? null : requireString(body.video_url, 'video_url');
  }
  if (body.duration !== undefined) {
    data.duration = isEmpty(body.duration) ? null : requirePositiveInt(body.duration, 'duration');
  }
  return data;
}

function validateTypeRules({ type, videoUrl, duration }) {
  if (type === 'movie' && (isEmpty(videoUrl) || isEmpty(duration))) {
    throw httpError(400, 'Movie wajib memiliki video_url dan duration');
  }
  if (type === 'series' && (!isEmpty(videoUrl) || !isEmpty(duration))) {
    throw httpError(400, 'Series tidak boleh memiliki video_url dan duration');
  }
}

async function ensureSlugAvailable(slug, excludeId) {
  const existing = await prisma.content.findUnique({ where: { slug } });
  if (existing && existing.id !== excludeId) {
    throw httpError(409, 'Slug sudah digunakan');
  }
}

async function parseGenreIds(genreIds) {
  if (genreIds === undefined) {
    return [];
  }
  if (!Array.isArray(genreIds)) {
    throw httpError(400, 'genre_ids harus berupa array');
  }
  const ids = [...new Set(genreIds.map((id) => parseId(id, 'genre_ids berisi ID tidak valid')))];
  const count = await prisma.genre.count({ where: { id: { in: ids } } });
  if (count !== ids.length) {
    throw httpError(400, 'genre_ids berisi genre yang tidak ditemukan');
  }
  return ids;
}

async function findContent(id) {
  const content = await prisma.content.findUnique({ where: { id: parseId(id) } });
  if (!content) {
    throw httpError(404, 'Content tidak ditemukan');
  }
  return content;
}

async function getAll(filter = {}) {
  const where = {};
  if (filter.type !== undefined) {
    if (!CONTENT_TYPES.includes(filter.type)) {
      throw httpError(400, 'type harus movie atau series');
    }
    where.type = filter.type;
  }
  if (typeof filter.q === 'string' && filter.q.trim() !== '') {
    where.title = { contains: filter.q.trim() };
  }

  const contents = await prisma.content.findMany({
    where,
    include: genresInclude,
    orderBy: { createdAt: 'desc' },
  });
  return contents.map(withGenres);
}

async function getById(id) {
  const content = await prisma.content.findUnique({
    where: { id: parseId(id) },
    include: { ...genresInclude, episodes: { orderBy: { episodeNumber: 'asc' } } },
  });
  if (!content) {
    throw httpError(404, 'Content tidak ditemukan');
  }

  const result = withGenres(content);
  if (content.type !== 'series') {
    delete result.episodes;
  }
  return result;
}

async function add(body = {}) {
  const data = buildContentData(body);
  for (const field of ['title', 'slug', 'type', 'synopsis', 'poster_url', 'banner_url', 'age_rating', 'release_year']) {
    if (body[field] === undefined) {
      throw httpError(400, `${field} wajib diisi`);
    }
  }
  validateTypeRules(data);
  await ensureSlugAvailable(data.slug);
  const genreIds = await parseGenreIds(body.genre_ids);

  const content = await prisma.content.create({
    data: { ...data, genres: { create: genreIds.map((genreId) => ({ genreId })) } },
    include: genresInclude,
  });
  return withGenres(content);
}

async function update(id, body = {}) {
  const content = await findContent(id);
  const data = buildContentData(body);
  validateTypeRules({ ...content, ...data });

  if (content.type === 'series' && data.type === 'movie') {
    const episodeCount = await prisma.episode.count({ where: { contentId: content.id } });
    if (episodeCount > 0) {
      throw httpError(400, 'Series yang sudah memiliki episode tidak bisa diubah menjadi movie');
    }
  }
  if (data.slug !== undefined) {
    await ensureSlugAvailable(data.slug, content.id);
  }

  const updated = await prisma.content.update({
    where: { id: content.id },
    data,
    include: genresInclude,
  });
  return withGenres(updated);
}

async function remove(id) {
  const content = await findContent(id);
  await prisma.content.delete({ where: { id: content.id } });
}

module.exports = { getAll, getById, add, update, remove, findContent };
