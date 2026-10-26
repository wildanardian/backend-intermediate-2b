const { Router } = require('express');

const router = Router();

router.use('/auth', require('./authRoutes'));
router.use('/genres', require('./genreRoutes'));
router.use('/contents', require('./contentRoutes'));
router.use('/episodes', require('./episodeRoutes'));
router.use('/watchlist', require('./watchlistRoutes'));

module.exports = router;
