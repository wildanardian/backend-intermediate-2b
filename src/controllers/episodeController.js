const episodeService = require('../services/episodeService');

async function getAll(req, res) {
  const data = await episodeService.getAll(req.params.contentId);
  res.status(200).json({ success: true, message: 'Daftar episode berhasil diambil', data });
}

async function add(req, res) {
  const data = await episodeService.add(req.params.contentId, req.body);
  res.status(201).json({ success: true, message: 'Episode berhasil dibuat', data });
}

async function update(req, res) {
  const data = await episodeService.update(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Episode berhasil diperbarui', data });
}

async function remove(req, res) {
  await episodeService.remove(req.params.id);
  res.status(200).json({ success: true, message: 'Episode berhasil dihapus', data: null });
}

module.exports = { getAll, add, update, remove };
