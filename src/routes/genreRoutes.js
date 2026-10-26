const { Router } = require('express');
const genreController = require('../controllers/genreController');

const router = Router();

router.get('/', genreController.getAll);
router.get('/:id', genreController.getById);
router.post('/', genreController.add);
router.patch('/:id', genreController.update);
router.delete('/:id', genreController.remove);

module.exports = router;
