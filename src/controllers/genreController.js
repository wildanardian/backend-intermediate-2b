const genreService = require('../services/genreService');

async function getAll(req, res) {
  const data = await genreService.getAll();
  res.status(200).json({ success: true, message: 'Daftar genre berhasil diambil', data });
}

async function getById(req, res) {
  const data = await genreService.getById(req.params.id);
  res.status(200).json({ success: true, message: 'Detail genre berhasil diambil', data });
}

async function add(req, res) {
  const data = await genreService.add(req.body);
  res.status(201).json({ success: true, message: 'Genre berhasil dibuat', data });
}

async function update(req, res) {
  const data = await genreService.update(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Genre berhasil diperbarui', data });
}

async function remove(req, res) {
  await genreService.remove(req.params.id);
  res.status(200).json({ success: true, message: 'Genre berhasil dihapus', data: null });
}

module.exports = { getAll, getById, add, update, remove };
