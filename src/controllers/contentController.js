const contentService = require('../services/contentService');

async function getAll(req, res) {
  const data = await contentService.getAll({ type: req.query.type, q: req.query.q });
  res.status(200).json({ success: true, message: 'Daftar content berhasil diambil', data });
}

async function getById(req, res) {
  const data = await contentService.getById(req.params.id);
  res.status(200).json({ success: true, message: 'Detail content berhasil diambil', data });
}

async function add(req, res) {
  const data = await contentService.add(req.body);
  res.status(201).json({ success: true, message: 'Content berhasil dibuat', data });
}

async function update(req, res) {
  const data = await contentService.update(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Content berhasil diperbarui', data });
}

async function remove(req, res) {
  await contentService.remove(req.params.id);
  res.status(200).json({ success: true, message: 'Content berhasil dihapus', data: null });
}

module.exports = { getAll, getById, add, update, remove };
