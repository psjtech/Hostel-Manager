const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/', roomController.index);
router.post('/', roomController.create);
router.get('/:id', roomController.show);
router.put('/:id', roomController.update);
router.delete('/:id', roomController.delete);

module.exports = router;
