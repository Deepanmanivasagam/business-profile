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
        const {checkIn,checkOut,date} = req.body;
        if(!id){
            return res.status(400).json('enter the id and update');
        }
        const updatedattendance =await Attendance.findByIdAndUpdate(id,{checkIn,checkOut,date},{new:true});
        res.status(200).json({message:'records updated',updatedAttendance:updatedattendance});
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