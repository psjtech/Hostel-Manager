const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');

router.get('/', hostelController.index);
router.post('/', hostelController.create);
router.get('/:id', hostelController.show);
router.put('/:id', hostelController.update);
router.delete('/:id', hostelController.delete);

module.exports = router;
