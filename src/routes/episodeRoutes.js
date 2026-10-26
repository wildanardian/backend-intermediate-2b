const { Router } = require('express');
const episodeController = require('../controllers/episodeController');

const router = Router();

router.patch('/:id', episodeController.update);
router.delete('/:id', episodeController.remove);

module.exports = router;
