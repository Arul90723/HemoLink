const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Only hospitals can create requests (made public for demo/testing)
router.post('/', requestController.createRequest);

// Anyone logged in can view prioritized requests (or maybe just hospitals and admins)
router.get('/prioritized', requestController.getPrioritizedRequests);

// Find matching peers for a specific request
router.get('/:id/match', verifyToken, checkRole(['HOSPITAL', 'ADMIN']), requestController.matchRequest);

module.exports = router;
