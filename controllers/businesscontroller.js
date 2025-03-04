const Business = require('../models/business');
const User = require('../models/user');
const { Country, State, City } = require('../models/location');
const Employee = require('../models/employee');
const mongoose = require('mongoose');
// const moment = require('moment');

const createBusiness = async (req, res) => {
        
    const { CompanyName, contactInfo, address, services, FromDateCount,profilePicture, role, CountryName, StateName, CityName, employeeName } = req.body;
    console.log('entire employeenames:',req.body);
    console.log('employeename:',req.body.employeeName);
    
    try {

        const country = await Country.findById(CountryName);
        const state = await State.findById(StateName);
        const city = await City.findById(CityName);
        
        if (!country) {
            return res.status(400).json({ message: 'Invalid Country Name' });
        }
        if (!state) {
            return res.status(400).json({ message: 'Invalid State Name' });
        }
        if (!city) {
            return res.status(400).json({ message: 'Invalid City Name' });
        }
        

        
        const serviceAndGST = services.map(service => {
            const gstRate = service.gstRate || 10;
            const gstAmount = (service.price * gstRate) / 100;
            const totalAmount = service.price + gstAmount;

            return {
                ...service,
                gstRate,
                gstAmount,
                totalAmount,
            };
        });

         const newEmployee = new Employee({employeeName});
         await newEmployee.save();
         console.log('employee name:',newEmployee);
         
        const newBusiness = new Business({
            CompanyName,
            ClientId: req.user ? req.user._id : null,
            contactInfo,
            address,
            services: serviceAndGST,
            profilePicture,
            role,
            CountryName,
            StateName,
            CityName,
            employeeName:newEmployee._id
        });

        await newBusiness.save();
        res.status(200).json({ message: 'Business profile created successfully', newBusiness });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllBusinesses = async (req, res) => {
    try {
        const businesses = await Business.find().populate('CountryName','CountryName')
        .populate('StateName','StateName').populate('CityName','CityName').populate('employeeName','employeeName')
        res.status(200).json(businesses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getBusinessById = async (req, res) => {
    const { id } = req.params;
    try {
        const business = await Business.findById(id).populate('CountryName StateName CityName');
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }
        res.status(200).json(business);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getclientServiceAndDate = async (req, res) => {
    try {
        const getthrees = await Business.find()
            .populate('ClientId', 'username')
            .select('CompanyName services createdAt ClientId')
            
            const clientinfo = getthrees.map(getthree => ({
                clientName: getthree.ClientId?.username,
                companyName: getthree.CompanyName,
                services: getthree.services.map(service => service.serviceName),
                createdAt: getthree.createdAt.toISOString().split('T')[0],
            }));
            console.log(clientinfo[0].createdAt);
            
        res.status(200).json(clientinfo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching business details', error: error.message });
    }
};

const getclientById = async (req, res) => {
    try {
        const {id} = req.params;

        const business = await Business.findById(id)
            .populate({ path: 'ClientId', select: 'username' })
            .select('CompanyName services createdAt ClientId')

        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        const formattedBusiness = {
            clientName:business.ClientId.username,
            companyName: business.CompanyName,
            services: business.services.map(service => service.serviceName),
            createdAt: moment(business.createdAt).format('DD-MM-YYYY'),
        };

        res.status(200).json(formattedBusiness);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching business details', error: error.message });
    }
};

const getdate = async (req, res) => {   
    try {
        let { date, services, ClientId } = req.body;

        if (!date) {
            return res.status(400).json({ message: "Date parameter is required" });
        }

        let startOfDay = new Date(date);
        let endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999));

        let filter = {
            createdAt: { $gte: startOfDay, $lt: endOfDay }
        };

        if (ClientId) {
            filter.ClientId = ClientId;
        }

        if (services) {
            filter["services._id"] = services;
        }

        // console.log("Filter:", filter);

        const businesses = await Business.find(filter)
            .populate({ path: "ClientId", select: "username" })
            .select("ClientId services.serviceName")
            .lean();

        const result = businesses.map(biz => ({
            clientName: biz.ClientId?.username,
            serviceName: biz.services.map(service => service.serviceName)
        }));

        res.status(200).json({ message: `Client orders for date (${date})`, result });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};


const updateBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Received Business ID:', id);

        const { CompanyName, contactInfo, address, services, profilePicture, role, CountryName, StateName, CityName } = req.body;

        console.log('Received Country ID:', CountryName);
        console.log('Received State ID:', StateName);
        console.log('Received City ID:', CityName);

        const country = await Country.findById(CountryName);
        const state = await State.findById(StateName);
        const city = await City.findById(CityName);

        if (!country) return res.status(400).json({ message: 'Invalid Country ID' });
        if (!state) return res.status(400).json({ message: 'Invalid State ID' });
        if (!city) return res.status(400).json({ message: 'Invalid City ID' });

        console.log('Updating Business with:', { country, state, city });

        const objectId = new mongoose.Types.ObjectId(id);

        const updatedBusiness = await Business.findByIdAndUpdate(objectId, {
            CompanyName,
            contactInfo,
            address,
            services,
            profilePicture,
            role,
            CountryName: country._id,
            StateName: state._id, 
            CityName: city._id 
        }, { new: true });

        if (!updatedBusiness) {
            console.log('Business not found in database for update');
            return res.status(404).json({ message: 'Business not found' });
        }

        console.log('Updated Business:', updatedBusiness);
        res.status(200).json({ message: 'Business updated successfully', updatedBusiness });

    } catch (error) {
        console.error('Error in updateBusiness:', error);
        res.status(400).json({ message: error.message });
    }
};

// const autoincrement = async ()=>{
//     setInterval(async() => {
//        await Business.updateMany({},{$inc:{FromDateCount:1}});
//     },2000);
// }
// autoincrement();



// const getcount = async (req, res) => {
//     try {
//         const { id } = req.body;

//         const business = await Business.findById(id);
//         if (!business) {
//             return res.status(404).json({ message: "Business not found" });
//         }

//         res.status(200).json({ message: "counting Days", FromDateCount:`${business.FromDateCount} Days`});
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

const getServiceDateCount = async (req, res)=>{
    try{
        if(!req.body || Object.keys(req.body).length === 0){
            return res.status(400).json({ message: 'Request body is empty' });
        }

        const {id} = req.body;
        // console.log("serviceId:", id);

        if (!id){
            return res.status(400).json({ message: 'Service ID is required' });
        }
        const business = await Business.findOne({ 'services._id': id });
        if(!business){
            return res.status(404).json({ message: 'Service not found' });
        }
        const service = business.services.find(s => s._id.toString() === id);
        if(!service){
            return res.status(404).json({ message: 'Service not found' });
        }
        // log for virtual and serviceSchema
        console.log(service.todaydate);
        console.log(service.todayDate)
        const diffDays = Math.floor((new Date() - new Date(service.placedDate)) / (1000 * 60 * 60 * 24));
        res.json({ serviceName: service.serviceName,todayDate:new Date().toISOString().split('T')[0], Datecount: diffDays });
    }catch(error){
        res.status(500).json({ message: 'Error fetching service data', error });
    }
}

const filteruser = async (req,res)=>{
    try{
        const {placedDate} = req.body;
        // .toISOString().split('T')[0]
        const existingdate = new Date(placedDate).setHours(0, 0, 0, 0);
        const endoftheday = new Date(placedDate).setHours(23, 59, 59, 999);

        const filter={
                createdAt: {$gte:existingdate, $lte:endoftheday}
            }
        const newdate = await User.find(filter);
        res.status(200).json({result:newdate})
    }catch(error){
          res.status(400).json({message:error.message})
    }
}

const highpaid = async (req, res) => {
    try {
        const {placedfrom,placedto,serviceName} = req.body;

        const startingdate = new Date(placedfrom);
        const endingdate = new Date(placedto);
        endingdate.setHours(23, 59, 59, 999); 

        const aggregated = await Business.aggregate([
            {
                $match:{
                createdAt:{$gte:startingdate,$lte: endingdate }
                }
            },
            {$unwind:"$services"},
            {
                $match:{
                "services.serviceName":serviceName
                }
            },
            {
                $group:{
                _id:"$services.serviceName",
                totalAmount:{$sum:"$services.totalAmount"},
                Placed:{$sum: 1}
                }
            },
            {
                $project:{
                _id:0,
                serviceName:"$_id",
                totalAmount:1,
                Placed:1
                }
            }
        ]);

        res.status(200).json({result:aggregated});
    }catch(error){
        res.status(400).json({message:error.message});
    }
}

const getFilteredBusinessDate = async (req, res)=>{
    try{
        const {createdAtFrom,createdAtTo} = req.body;

        const startDate = new Date(createdAtFrom);
        const endDate = new Date(createdAtTo);
        endDate.setHours(23, 59, 59, 999); 

        const businesses = await Business.find({
            createdAt:{$gte:startDate, $lte:endDate}
        }).populate("ClientId", "username").populate({path:"StateName", select:"StateName -_id"})

        if(!businesses){
            return res.status(404).json({message:"in the given date range no business found"});
        }

        const finaldata = businesses.flatMap(business => business.services.map(service => ({
                userName:business.ClientId?.username,
                contactInfo:business.contactInfo,
                companyName: business.CompanyName,
                serviceName: service.serviceName,
                totalAmount: service.totalAmount,
                stateName:business.StateName?.StateName,
    }))
);
        res.status(200).json({totaldata:finaldata.length, result:finaldata});
    }catch(error){
        res.status(500).json({ message: "Error fetching filtered business data", error });
    }
}

const deleteBusiness = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBusiness = await Business.findByIdAndDelete(id);
        if (!deletedBusiness) {
            return res.status(404).json({ message: 'Business not found' });
        }
        res.status(200).json({ message: 'Business deleted successfully', deletedBusiness });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createBusiness, getAllBusinesses, getBusinessById, getclientServiceAndDate,getclientById,getdate, updateBusiness,filteruser, getServiceDateCount,highpaid,getFilteredBusinessDate, deleteBusiness };