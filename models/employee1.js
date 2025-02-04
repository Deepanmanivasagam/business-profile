const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    status: { type: String, default: 'Absent' }  // Default status is 'Absent'
});

const employee1Schema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    attendance: [attendanceSchema]  // Attendance array for 30/31 days
});

module.exports = mongoose.model('Employee1', employee1Schema);