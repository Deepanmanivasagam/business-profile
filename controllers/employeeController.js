const Employee = require('../models/employee');
const Business = require('../models/business')


const createEmployee = async(req,res)=>{
    try{
         const {employeeName,teamName,Gender,projects,salary,experience} = req.body;
         const newemployee = new Employee({
                             employeeName,
                             teamName,
                             Gender,
                             projects,
                             salary,
                             experience,
                            });
         await newemployee.save()
         res.status(200).json({message:'employee added',employee:newemployee});
    }catch(error){
        res.status(200).json({message:error.message});
    }
}

const getEmployeeNames = async (req, res) => {
    try {
                const businesses = await Employee.find().populate('employeeName','employeeName').populate('teamName','teamName');
                res.status(200).json(businesses);
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
};

const updateEmployee = async (req,res)=>{
    try{
        const {id} = req.params;
        const {employeeName, teamName, Gender, projects, salary, experience}=req.body;
        
        const updatedemployee = await Employee.findByIdAndUpdate(id,{employeeName,teamName,Gender, projects,salary,experience},{new:true,runValidators:true});
        if(!updatedemployee){
           return res.status(400).json('employee id not found')
        }
        res.status(200).json({message:'employee updated successfully',employee:updatedemployee});
    }
    catch(error){
      res.status(400).json({message:error.message});
    }
}

const deleteemployee = async(req,res)=>{
    try{
      const {id} = rea.params;
      const deletedemployee = await Employee.findByIdAndDelete(id);
      if(!deletedemployee){
        return res.status(400).json('employee not found');
      }
    }catch(error){
         res.status(400).json({message:error.message});
    }
}

module.exports = {
    getEmployeeNames,
    createEmployee,
    updateEmployee,
    deleteemployee
};