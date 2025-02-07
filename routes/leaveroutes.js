const express = require('express');
const router = express.Router();
const leavecontroller = require('../controllers/leavecontroller');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');

// common leave apply
router.post('/applyleave', leavecontroller.applyLeave);

// casual and medical leave approval(update)
router.put('/approveleave/:id', authMiddleware,authorizeAdmin,leavecontroller.updateLeaveStatus);
router.put('/approvemedical/:id',authMiddleware,authorizeAdmin,leavecontroller.updatemedicalStatus);

// get status for both casual and medical
router.get('/getstatus/:id',leavecontroller.getleaveresponse);

// delete here
router.delete('/deleterequest/:id',leavecontroller.deleteleave);
module.exports = router;