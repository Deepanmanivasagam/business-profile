const { Country, State, City } = require('../models/location');

const createCountry = async (req, res) => {
    const { CountryName } = req.body;
    
    try {
        const newCountry = new Country({ CountryName });
        await newCountry.save();
        res.status(201).json({ message: 'Country created successfully', newCountry });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createState = async (req, res) => {
    const { StateName } = req.body;
    
    try {
        const newState = new State({ StateName });
        await newState.save();
        res.status(201).json({ message: 'State created successfully', newState });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createCity = async (req, res) => {
    const { CityName } = req.body;
    
    try {
        const newCity = new City({ CityName });
        await newCity.save();
        res.status(201).json({ message: 'City created successfully', newCity });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const getAllCountries = async (req, res) => {
    try {
        const countries = await Country.find();
        res.status(200).json(countries);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const getAllStates = async (req, res) => {
    try {
        const states = await State.find();
        res.status(200).json(states);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const getAllCities = async (req, res) => {
    try {
        const cities = await City.find();
        res.status(200).json(cities);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateCountry = async (req,res)=>{
    try{
    const {id} = req.params;
    const {CountryName} = req.body;
    const updatecountry = await Country.findByIdAndUpdate(id,{CountryName},{new:true});
    if(!updatecountry){
        return res.status(400).json({message:'country id not found'})
    }
    res.status(200).json({message:'countryName updated',});
}catch(error){
     res.status(400).json({message:error.message});
}
}

const updateState = async (req,res)=>{
    try{
    const {id} = req.params;
    const {StateName} = req.body;
    const updatestate = await State.findByIdAndUpdate(id,{StateName},{new:true});
    if(!updatestate){
        return res.status(400).json({message:'state id not found'})
    }
    res.status(200).json({message:'StateName updated',});
}catch(error){
     res.status(400).json({message:error.message});
}
}

const updateCity = async (req,res)=>{
    try{
    const {id} = req.params;
    const {CityName} = req.body;
    const updatecity = await City.findByIdAndUpdate(id,{CityName},{new:true});
    if(!updatecity){
        return res.status(400).json({message:'city id not found'})
    }
    res.status(200).json({message:'cityName updated',});
}catch(error){
     res.status(400).json({message:error.message});
}
}

const deleteCountry = async(req,res)=>{
    try{
       const {id} = req.params;
       const deletecountry =  await Country.findByIdAndDelete(id);
       if(!deletecountry){
        return res.status(400).json('id not found');
       }
       res.status(200).json({messaage:'country deleted successfully'});
    }catch(error){
     res.status(400).json({message:error.messaage});
    }
}

const deleteState = async(req,res)=>{
    try{
       const {id} = req.params;
       const deletestate =  await State.findByIdAndDelete(id);
       if(!deletestate){
        return res.status(400).json('id not found');
       }
       res.status(200).json({messaage:'state deleted successfully'});
    }catch(error){
     res.status(400).json({message:error.messaage});
    }
}

const deleteCity = async(req,res)=>{
    try{
       const {id} = req.params;
       const deletecity =  await City.findByIdAndDelete(id);
       if(!deletecity){
        return res.status(400).json('id not found');
       }
       res.status(200).json({messaage:'city deleted successfully'});
    }catch(error){
     res.status(400).json({message:error.messaage});
    }
}

module.exports = { createCountry, createState, createCity, getAllCountries, getAllStates, getAllCities, updateCountry, updateState, updateCity, deleteCountry, deleteState, deleteCity};