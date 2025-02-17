const mongoose = require('mongoose');
const {Country,State,City} = require('./location');

const serviceSchema = new mongoose.Schema({
    serviceName: {type:String, required:true},
    description:{type:String},
    price:{type:Number,required:true},
    gstRate:{type:Number,default:10},
    gstAmount:{type:Number},
    totalAmount:{type:Number},
    productDetails:{type:String},
    availability:{type:Boolean,default:true},
});

serviceSchema.pre('save',function(next){
    this.gstAmount = (this.price*this.gstRate)/100;
    this.totalAmount = (this.price+this.gstAmount);
    next();
});

const businessSchema = new mongoose.Schema({
    CompanyName:{type:String,
                  required:true,
                  unique:true,
                },
    ClientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    contactInfo:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    services:[serviceSchema],
    FromDateCount:{
        type:Number,
        default:0,
    },
    profilePicture:{
        type:String,
        required:false,
    },
    role:{type:String,
         default:'user',
    },
    CountryName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Country',
    },
    StateName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'State',
    },
    CityName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'City'
    },
    employeeName:[{type:mongoose.Schema.Types.ObjectId,
        ref:'Employee'
    }],
},
{timestamps:true},
{versionkey:false}
);

const Business = mongoose.model('Business',businessSchema)

module.exports = Business;