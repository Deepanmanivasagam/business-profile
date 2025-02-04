const Employee1 = require('../models/employee1');
const bcrypt = require('bcrypt'); // For password hashing

// Helper function to generate attendance for 30 or 31 days based on the month
const generateAttendance = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();  // Get 30 or 31 days
    const attendance = [];

    for (let day = 1; day <= daysInMonth; day++) {
        attendance.push({
            date: new Date(year, month - 1, day),
            status: 'Absent'  // Default status on login
        });
    }

    return attendance;
};

// Controller for employee login
const employeeLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if employee exists in the database
        const employee = await Employee1.findOne({ username });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if attendance already exists for the current month
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const existingAttendance = employee.attendance.find(att =>
            new Date(att.date).getMonth() + 1 === currentMonth &&
            new Date(att.date).getFullYear() === currentYear
        );

        if (!existingAttendance) {
            // Generate attendance for the current month
            const attendance = generateAttendance(currentMonth, currentYear);
            employee.attendance.push(...attendance);  // Add attendance for the month
            await employee.save();  // Save the employee with the new attendance
        }

        // Send back the successful login response
        res.status(200).json({ message: 'Login successful', attendance: employee.attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    employeeLogin
};