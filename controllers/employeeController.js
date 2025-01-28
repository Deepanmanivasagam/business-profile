const Employee = require('../models/employee');
const Business = require('../models/business')


const createEmployee = async(req,res)=>{
    try{
         const {employeeName,teamName} = req.body;
         const newemployee = new Employee({employeeName,teamName});
         await newemployee.save()
         res.status(200).json({message:'employee added'});
    }catch(error){
        res.status(200).json({message:error.message});
    }
}

const getAllEmployeeNames = async (req, res) => {
    try {
                const businesses = await Employee.find().populate('employeeName','employeeName').populate('teamName','teamName');
                res.status(200).json(businesses);
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
};

module.exports = {
    getAllEmployeeNames,
    createEmployee,
};