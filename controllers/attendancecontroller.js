const Attendance = require('../models/attendance');

const addAttendance = async (req, res) => {
    try {
        const { employeeId, checkIn, checkOut, date } = req.body;

        if (!employeeId || !checkIn || !checkOut) {
            return res.status(400).json({ message: 'Please enter all required fields.' });
        }

        const attendanceDate = date || new Date().toISOString().split('T')[0];

        const newAttendance = new Attendance({
            employeeId,
            date: attendanceDate,
            checkIn,
            checkOut
        });

        await newAttendance.save();
        res.status(200).json({ message: 'Attendance recorded successfully', newAttendance });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getattendance = async(req,res)=>{
    try{
      const findemployee = await Attendance.find();
      res.status(200).json({message:'employees records fetched',employees:findemployee})
    }catch(error){
       res.status(400).json({message:error.message});
    }
}

const getattendanceById = async(req,res)=>{
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json('enter the id you want');
        }
       const findemployeeById = await Attendance.findById(id);
       res.status(200).json({message:'employee records fetched By Id',findemployeeById});
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

const updateattendance = async(req,res)=>{
    try{
        const {id} = req.params;
        const {checkIn,checkOut} = req.body;

        const attendance = await Attendance.findById(id);
        if(!attendance){
            return res.status(400).json({message:'attendance not found'});
        }

        attendance.checkIn = checkIn;
        attendance.checkOut = checkOut;
        await attendance.save();
        res.status(200).json({message:'records updated',updatedAttendance:attendance});
    }catch(error){
        res.status(400).json({message:error.message});
    }
}

const deleteAttendance = async(req,res)=>{
    try{
    const {id} = req.params;

    const deletedId = await Attendance.findByIdAndDelete(id);
    res.status(200).json({message:'id deleted',Iddetails:deletedId});
    }catch(error){
              res.status(400).json({message:error.message});
    }
}

module.exports = {
    addAttendance,
    getattendance,
    getattendanceById,
    updateattendance,
    deleteAttendance,
};

const cron = require('node-cron');
const Employee = require('../models/employee');

cron.schedule('59 23 * * *', async () => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const allEmployees = await Employee.find();
        const attendedEmployees = await Attendance.find({ date: today }).distinct('employeeId');

        const absentEmployees = allEmployees.filter(emp => !attendedEmployees.includes(emp._id.toString()));

        const absentRecords = absentEmployees.map(emp => ({
            employeeId: emp._id,
            date: today,
            checkIn: null,
            checkOut: null,
            duration: 0,
            status: 'Absent',
        }));

        if (absentRecords.length) {
            await Attendance.insertMany(absentRecords);
            console.log(`Marked ${absentRecords.length} employees as Absent for ${today}`);
        } else {
            console.log(' No absentees found today.');
        }

    } catch (error) {
        console.error('Error marking absentees:', error.message);
    }
});