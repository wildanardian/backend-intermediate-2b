function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function parseId(value, message = 'ID tidak valid') {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw httpError(400, message);
  }
  return id;
}

function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500;
  let message = err.message;

  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Format JSON tidak valid';
  } else if (err.code === 'P2002') {
    status = 409;
    message = 'Data sudah ada';
  } else if (err.code === 'P2025') {
    status = 404;
    message = 'Data tidak ditemukan';
  } else if (status === 500) {
    console.error(err);
    message = 'Terjadi kesalahan pada server';
  }

  res.status(status).json({ success: false, message });
}

module.exports = { httpError, parseId, notFound, errorHandler };
