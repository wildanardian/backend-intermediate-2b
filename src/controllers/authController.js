const authService = require('../services/authService');

async function register(req, res) {
  const data = await authService.register(req.body);
  res.status(201).json({ success: true, message: 'Registrasi berhasil', data });
}

async function login(req, res) {
  const data = await authService.login(req.body);
  res.status(200).json({ success: true, message: 'Login berhasil', data });
}

module.exports = { register, login };
