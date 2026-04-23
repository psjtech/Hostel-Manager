const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.index);
router.get('/add', studentController.addForm);
router.post('/', studentController.create);
router.get('/:id', studentController.show);
router.get('/:id/edit', studentController.editForm);
router.post('/:id', studentController.update);
router.post('/:id/delete', studentController.delete);

module.exports = router;
