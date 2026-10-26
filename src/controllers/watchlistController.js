const watchlistService = require('../services/watchlistService');

async function getAll(req, res) {
  const data = await watchlistService.getAll(req.user.id);
  res.status(200).json({ success: true, message: 'Watchlist berhasil diambil', data });
}

async function add(req, res) {
  const data = await watchlistService.add(req.user.id, req.body);
  res.status(201).json({ success: true, message: 'Content berhasil ditambahkan ke watchlist', data });
}

async function remove(req, res) {
  await watchlistService.remove(req.user.id, req.params.contentId);
  res.status(200).json({ success: true, message: 'Content berhasil dihapus dari watchlist', data: null });
}

module.exports = { getAll, add, remove };
