const Business = require('../models/business');
const { Country, State, City } = require('../models/location');
const Employee = require('../models/employee');
const mongoose = require('mongoose');

const createBusiness = async (req, res) => {
        
    const { CompanyName, contactInfo, address, services, profilePicture, role, CountryName, StateName, CityName, employeeName } = req.body;
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
            OwnerId: req.user ? req.user._id : null,
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

module.exports = { createBusiness, getAllBusinesses, getBusinessById, updateBusiness, deleteBusiness };