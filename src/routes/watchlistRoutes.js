const { Router } = require('express');
const auth = require('../middlewares/auth');
const watchlistController = require('../controllers/watchlistController');

const router = Router();

router.use(auth);

router.get('/', watchlistController.getAll);
router.post('/', watchlistController.add);
router.delete('/:contentId', watchlistController.remove);

module.exports = router;
