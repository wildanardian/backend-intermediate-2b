const jwt = require('jsonwebtoken');
const { httpError } = require('./errorHandler');

function auth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(httpError(401, 'Token tidak ditemukan'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch {
    next(httpError(401, 'Token tidak valid atau sudah kedaluwarsa'));
  }
}

module.exports = auth;
