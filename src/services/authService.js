const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { httpError } = require('../middlewares/errorHandler');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  createdAt: true,
};

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

async function register(body = {}) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = normalizeEmail(body.email);
  const { password } = body;

  if (!name) {
    throw httpError(400, 'Nama wajib diisi');
  }
  if (!EMAIL_REGEX.test(email)) {
    throw httpError(400, 'Email tidak valid');
  }
  if (typeof password !== 'string' || password.length < 6) {
    throw httpError(400, 'Password minimal 6 karakter');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw httpError(409, 'Email sudah terdaftar');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { name, email, passwordHash },
    select: publicUserSelect,
  });
}

async function login(body = {}) {
  const email = normalizeEmail(body.email);
  const { password } = body;

  if (!email || typeof password !== 'string' || password === '') {
    throw httpError(400, 'Email dan password wajib diisi');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw httpError(401, 'Email atau password salah');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return { token };
}

module.exports = { register, login };
