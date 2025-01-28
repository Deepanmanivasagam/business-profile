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

module.exports = { createCountry, createState, createCity, getAllCountries, getAllStates, getAllCities };