const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

router.get('/', complaintController.index);
router.get('/form-data', complaintController.formData);
router.post('/', complaintController.create);
router.get('/:id', complaintController.show);
router.patch('/:id/status', complaintController.updateStatus);
router.delete('/:id', complaintController.delete);

module.exports = router;
