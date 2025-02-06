const Leave = require('../models/leavemodel');
const Employee = require('../models/employee');

// Apply for leave
const applyLeave = async (req, res) => {
    try {
        const { employeeId, date, leaveType } = req.body;

        if (!employeeId || !date || !leaveType) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (!['casual', 'medical', 'holidays'].includes(leaveType)) {
            return res.status(400).json({ message: 'Invalid leave type.' });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(400).json({ message: 'Employee not found.' });
        }

        // Check leave balance before applying
        if (leaveType === 'casual' && employee.leave_blance.casual_Leave <= 0) {
            return res.status(400).json({ message: 'No casual leaves left.' });
        }
        if (leaveType === 'medical' && employee.leave_blance.medical_Leave <= 0) {
            return res.status(400).json({ message: 'Medical leave is not available.' });
        }

        const newLeave = new Leave({
            employeeId,
            date,
            leaveType,
            status: 'pending',
        });

        await newLeave.save();
        res.status(200).json({ message: 'Leave request submitted', leave: newLeave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Approve or Reject Leave (Admin Only)
const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params; // Leave ID
        const { status } = req.body; // 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }

        const leave = await Leave.findById(id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found.' });
        }

        // Check if leave is already approved/rejected
        if (leave.status === 'approved' || leave.status === 'rejected') {
            return res.status(400).json({ message:` Leave is already ${leave.status}. `});
        }

        // If approving, deduct leave balance
        if (status === 'approved') {
            const employee = await Employee.findById(leave.employeeId);
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found.' });
            }

            if (leave.leaveType === 'casual' && employee.leave_blance.casual_Leave > 0) {
                employee.leave_blance.casual_Leave -= 1;
                await employee.save();
            } else if (leave.leaveType === 'casual') {
                return res.status(400).json({ message: 'Not enough casual leave balance.' });
            }
        }

        leave.status = status;
        await leave.save();

        res.status(200).json({ message: `Leave ${status} successfully.`, leave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyLeave,
    updateLeaveStatus,
};