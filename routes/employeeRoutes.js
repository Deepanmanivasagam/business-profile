const express = require('express');
const protect = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const Employee = require('../models/employee');
const Business = require('../models/business')
const {getEmployeeNames,createEmployee,updateEmployee,deleteemployee} = require('../controllers/employeeController')

const router = express.Router();

router.get('/admin/employeeNames', protect, authorizeAdmin,getEmployeeNames);
router.post('/admin/postemployee', protect, authorizeAdmin,createEmployee);
router.put('/admin/updateemployee/:id', protect, authorizeAdmin,updateEmployee);
router.delete('/admin/deleteemployee/:id', protect, authorizeAdmin,deleteemployee);

module.exports = router;