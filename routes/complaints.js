const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

router.get('/', complaintController.index);
router.get('/add', complaintController.addForm);
router.post('/', complaintController.create);
router.get('/:id', complaintController.show);
router.post('/:id/status', complaintController.updateStatus);
router.post('/:id/delete', complaintController.delete);

module.exports = router;
