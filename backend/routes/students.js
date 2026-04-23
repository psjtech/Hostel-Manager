const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.index);
router.post('/', studentController.create);
router.get('/:id', studentController.show);
router.put('/:id', studentController.update);
router.delete('/:id', studentController.delete);

module.exports = router;
