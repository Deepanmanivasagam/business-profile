const mongoose = require('mongoose');

const teamschema = new mongoose.Schema({
    teamName:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    team_leader:{
        type:String,
        required:true, 
    },
    employees:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee',
    }]
},
{timestamps:true},
{versionkey:false})

const Team = new mongoose.model("Team",teamschema);

module.exports = Team;