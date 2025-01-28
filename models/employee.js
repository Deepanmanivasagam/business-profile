const mongoose = require('mongoose');

const employeeschema = new mongoose.Schema({
    employeeName:{
        type:String,
        required:true,
    },
    teamName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team'
    }
})

const Employee = mongoose.model('Employee',employeeschema);
module.exports = Employee;