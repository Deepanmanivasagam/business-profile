const express = require('express');
const router = express.Router();
const { employeeLogin } = require('../controllers/employee1controller');

// Route for employee login
router.post('/employee1/login', employeeLogin);

module.exports = router;