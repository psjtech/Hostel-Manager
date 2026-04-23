const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');

router.get('/', hostelController.index);
router.get('/add', hostelController.addForm);
router.post('/', hostelController.create);
router.get('/:id', hostelController.show);
router.get('/:id/edit', hostelController.editForm);
router.post('/:id', hostelController.update);
router.post('/:id/delete', hostelController.delete);

module.exports = router;
