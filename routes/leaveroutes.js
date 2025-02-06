const express = require('express');
const router = express.Router();
const leavecontroller = require('../controllers/leavecontroller');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');

router.post('/applyleave', leavecontroller.applyLeave);
router.put('/approveleave/:id', authMiddleware,authorizeAdmin,leavecontroller.updateLeaveStatus);

module.exports = router;