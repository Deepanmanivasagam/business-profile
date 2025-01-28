const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    CountryName: {
        type: String,
        required: true,
    },
});

const stateSchema = new mongoose.Schema({
    StateName: {
        type: String,
        required: true,
    },
});

const citySchema = new mongoose.Schema({
    CityName: {
        type: String,
        required: true,
    },
},
{versionKey:false}
);



const Country = mongoose.model('Country', countrySchema);
const State = mongoose.model('State', stateSchema);
const City = mongoose.model('City', citySchema);

module.exports = { Country, State, City };