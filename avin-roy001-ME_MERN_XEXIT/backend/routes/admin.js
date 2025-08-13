const express = require('express');
const { getAllResignations, concludeResignation } = require('../controllers/resignationController');
const { getAllExitResponses } = require('../controllers/exitController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/resignations', auth('hr'), getAllResignations);
router.put('/conclude_resignation', auth('hr'), concludeResignation);
router.get('/exit_responses', auth('hr'), getAllExitResponses);

module.exports = router;