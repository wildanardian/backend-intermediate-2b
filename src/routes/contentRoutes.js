const { Router } = require('express');
const contentController = require('../controllers/contentController');
const episodeController = require('../controllers/episodeController');

const router = Router();

router.get('/', contentController.getAll);
router.get('/:id', contentController.getById);
router.post('/', contentController.add);
router.patch('/:id', contentController.update);
router.delete('/:id', contentController.remove);

router.get('/:contentId/episodes', episodeController.getAll);
router.post('/:contentId/episodes', episodeController.add);

module.exports = router;
