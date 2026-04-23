const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocationController');

router.get('/', allocationController.index);
router.get('/fee-summary', allocationController.feeSummary);
router.get('/form-data', allocationController.formData);
router.post('/', allocationController.create);
router.get('/:id', allocationController.show);
router.patch('/:id/vacate', allocationController.vacate);
router.post('/:id/payment', allocationController.recordPayment);

module.exports = router;
