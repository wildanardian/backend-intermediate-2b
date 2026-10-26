const prisma = require('../config/prisma');
const { httpError, parseId } = require('../middlewares/errorHandler');

function validateName(name) {
  if (typeof name !== 'string' || name.trim() === '') {
    throw httpError(400, 'Nama genre wajib diisi');
  }
  return name.trim();
}

async function ensureNameAvailable(name, excludeId) {
  const existing = await prisma.genre.findUnique({ where: { name } });
  if (existing && existing.id !== excludeId) {
    throw httpError(409, 'Nama genre sudah digunakan');
  }
}

async function getAll() {
  return prisma.genre.findMany({ orderBy: { name: 'asc' } });
}

async function getById(id) {
  const genre = await prisma.genre.findUnique({ where: { id: parseId(id) } });
  if (!genre) {
    throw httpError(404, 'Genre tidak ditemukan');
  }
  return genre;
}

async function add(body = {}) {
  const name = validateName(body.name);
  await ensureNameAvailable(name);
  return prisma.genre.create({ data: { name } });
}

async function update(id, body = {}) {
  const genre = await getById(id);
  const name = validateName(body.name);
  await ensureNameAvailable(name, genre.id);
  return prisma.genre.update({ where: { id: genre.id }, data: { name } });
}

async function remove(id) {
  const genre = await getById(id);
  await prisma.genre.delete({ where: { id: genre.id } });
}

module.exports = { getAll, getById, add, update, remove };
