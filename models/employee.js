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
    date_of_birth:{
        type:Date,
    },
    age:{
        type:Number
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
    employment_type:{
        type:String,
    },
    job_title:{
        type:String
    },
    leave_blance:{
        casual_Leave:{
            type:Number,
            default:12,
        },
        medical_Leave:{
            type:Number,
            default:8,
        },
    },
    documents:{
        type:String,
        required:true,
    }
});

function calculateage(date_of_birth){
    const today = new Date();
    const birthdate = new Date(date_of_birth);
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthdiff = today.getMonth() - birthdate.getMonth();
    if( monthdiff<0 || monthdiff ===0 && birthdate.getDate() > today.getDate()){
        age--;
    }
    return age;
}

employeeschema.pre('save',function(next){
    this.age = calculateage(this.date_of_birth);
    next();
})

const Employee = mongoose.model('Employee',employeeschema);
module.exports = Employee;