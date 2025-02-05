const express = require('express');
const router = express.Router();

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
router.put('/updateattendance/:id',updateattendance);
router.delete('/delete/:id',deleteAttendance);

module.exports = router;