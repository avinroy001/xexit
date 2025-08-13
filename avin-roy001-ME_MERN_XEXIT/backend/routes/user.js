const express = require('express');
const { submitResignation } = require('../controllers/resignationController');      // Only submitResignation
const { submitExitResponses } = require('../controllers/exitController');           // Only submitExitResponses
const auth = require('../middleware/auth');

const router = express.Router();

// Use the correct functions
router.post('/resign', auth('employee'), submitResignation);
router.post('/responses', auth('employee'), submitExitResponses);

module.exports = router;