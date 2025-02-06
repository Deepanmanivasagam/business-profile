const mongoose =  require('mongoose');

const leaveschema = new mongoose.Schema({
    employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    date:{
        type:Date,
    },
    leaveType:{
        type:String,
        enum:['casual','medical','holidays'],
        required:true,
    },
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        // default:'pending',
    },
})

const Leave = new mongoose.model("Leave",leaveschema);
module.exports = Leave;