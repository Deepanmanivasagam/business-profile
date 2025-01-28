const Team = require('../models/team');

const createTeam = async (req, res) => {
    try {
        console.log('making a request to allow amdin:',req.user);
        
       if(!req.user || req.user.role !=="admin"){
        return res.status(403).json({message:"access denied.."});
       }

        const { teamName, role, employees } = req.body;
        const newTeam = new Team({
            teamName,
            role,
            employees,
        });
        await newTeam.save();
        res.status(201).json({ message: 'Team created successfully', newTeam });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate('employees', 'employees');
        res.status(200).json(teams);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('employees', 'employees');
        if (!team) return res.status(404).json({ message: 'Team not found' });
        res.status(200).json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTeam = async (req, res) => {
    try {
        const { teamName, role, employees } = req.body;
        const updatedTeam = await Team.findByIdAndUpdate(
            req.params.id,
            { teamName, role, employees },
            { new: true }
        );
        if (!updatedTeam) return res.status(404).json({ message: 'Team not found' });
        res.status(200).json({ message: 'Team updated successfully', updatedTeam });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTeam = async (req, res) => {
    try {
        const deletedTeam = await Team.findByIdAndDelete(req.params.id);
        if (!deletedTeam) return res.status(404).json({ message: 'Team not found' });
        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createTeam,
    getAllTeams,
    getTeamById,
    updateTeam,
    deleteTeam,
};