const mongoose = require('mongoose');

const employeeschema = new mongoose.Schema({
    employeeName:{
        type:String,
        required:true,
    },
    teamName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team'
    },  
    Gender:{
        type:String,
        enum:['Male','female','others']
    },
    projects:{
        type:Number,
        min:0
    },
    salary:{
        type:Number,
        min:0
    },
    experience:{
        type:String,
        min:0
    },
    // performanceRating:{
    //     type:String,
    //     required:true,
    //     min:0,
    //     max:10
    // },
})

const Employee = mongoose.model('Employee',employeeschema);
module.exports = Employee;