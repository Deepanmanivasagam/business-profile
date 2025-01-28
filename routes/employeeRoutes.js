const express = require('express');
const protect = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const Employee = require('../models/employee');
const Business = require('../models/business')
const {getAllEmployeeNames,createEmployee} = require('../controllers/employeeController')

const router = express.Router();

router.get('/admin/employeeNames', protect, authorizeAdmin,getAllEmployeeNames);
router.post('/admin/postemployee', protect, authorizeAdmin,createEmployee);

module.exports = router;