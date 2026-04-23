const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocationController');

router.get('/', allocationController.index);
router.get('/add', allocationController.addForm);
router.get('/fee-summary', allocationController.feeSummary);
router.post('/', allocationController.create);
router.get('/:id', allocationController.show);
router.post('/:id/vacate', allocationController.vacate);
router.get('/:id/payment', allocationController.paymentForm);
router.post('/:id/payment', allocationController.recordPayment);

module.exports = router;
