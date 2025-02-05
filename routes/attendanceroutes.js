const express = require('express');
const router = express.Router();
const authorizeAdmin = require('../middleware/authorizeAdmin');
const protect = require('../middleware/authMiddleware');

const {
    addAttendance,
    getattendance,
    getattendanceById,
    updateattendance,
    deleteAttendance,
} = require('../controllers/attendancecontroller');

router.post('/add',addAttendance);
router.get('/getall',getattendance);
router.get('/getbyid/:id',getattendanceById);
router.put('/updateattendance/:id',protect,authorizeAdmin,updateattendance);
router.delete('/delete/:id',protect,authorizeAdmin,deleteAttendance);

module.exports = router;