const Leave = require('../models/leavemodel');
const Employee = require('../models/employee');


const applyLeave = async (req, res) => {
    try {
        const { employeeId, date, leaveType } = req.body;

        if (!employeeId || !date || !leaveType) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (!['casual', 'medical',].includes(leaveType)) {
            return res.status(400).json({ message: 'Invalid leave type.' });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(400).json({ message: 'Employee not found.' });
        }

    
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

const getleaveresponse = async (req,res)=>{
    try{
    const {id} = req.params;
    if(!id){
        return res.status(400).json('id not found');
    }
    const leaveupdate = await Leave.findById(id);
    res.status(200).json({message:'id fetched',leaveupdate:leaveupdate});
}catch(error){
     res.status(400).json({message:error.message});
}
}

const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params; 
        const { status } = req.body; 

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }

        const leave = await Leave.findById(id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found.' });
        }

        
        if (leave.status === 'approved' || leave.status === 'rejected') {
            return res.status(400).json({ message:` Leave is already ${leave.status}. `});
        }

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


const updatemedicalStatus = async (req, res) => {
    try {
        const { id } = req.params; 
        const { status } = req.body; 

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }

        const leave = await Leave.findById(id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found.' });
        }

        
        if (leave.status === 'approved' || leave.status === 'rejected') {
            return res.status(400).json({ message:` Leave is already ${leave.status}. `});
        }

        if (status === 'approved') {
            const employee = await Employee.findById(leave.employeeId);
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found.' });
            }

            if (leave.leaveType === 'medical' && employee.leave_blance.medical_Leave > 0) {
                employee.leave_blance.medical_Leave -= 1;
                await employee.save();
            } else if (leave.leaveType === 'medical') {
                return res.status(400).json({ message: 'Not enough medical leave balance.' });
            }
        }

        leave.status = status;
        await leave.save();

        res.status(200).json({ message: `Leave ${status} successfully.`, leave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteleave = async(req,res)=>{
    try{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({message:'id not found'});
    }
    const deletedid =  await Leave.findByIdAndDelete(id);
    res.status(200).json({message:`${id}, deleted successfully`,deleted:deletedid});
    }catch(error){
    res.status(400).json({message:error.message});
    }
}

module.exports = {
    applyLeave,
    getleaveresponse,
    
    updateLeaveStatus,
    updatemedicalStatus,

    deleteleave,
};