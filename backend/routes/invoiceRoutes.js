const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const invoiceController = require('../controllers/invoiceController');

// All routes are protected
router.use(protect);

// Routes accessible by all authenticated users
router.get('/', invoiceController.getInvoices);
router.get('/:id', invoiceController.getInvoice);
router.post('/', invoiceController.createInvoice);
router.put('/:id', invoiceController.updateInvoice);

// Routes for adding comments, actions, and PTPs
router.post('/:id/comments', invoiceController.addComment);
router.post('/:id/actions', invoiceController.addAction);
router.put('/:id/actions/:actionId', invoiceController.updateActionStatus);
router.post('/:id/ptp', invoiceController.addPTP);

// Routes for assignment
router.put('/:id/assign', invoiceController.assignInvoice);
router.post('/bulk-assign', invoiceController.bulkAssignInvoices);

// Routes for audit trail
router.get('/:id/audit', invoiceController.getAuditTrail);

// Routes restricted to managers and admins
router.use(restrictTo('manager', 'admin'));
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router; 
