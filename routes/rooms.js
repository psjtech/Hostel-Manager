const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/', roomController.index);
router.get('/add', roomController.addForm);
router.post('/', roomController.create);
router.get('/:id', roomController.show);
router.get('/:id/edit', roomController.editForm);
router.post('/:id', roomController.update);
router.post('/:id/delete', roomController.delete);

module.exports = router;
