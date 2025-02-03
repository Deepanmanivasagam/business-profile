const express = require('express');
const { 
    createTeam,
    getAllTeams,
    getTeamById,
    updateTeam,
    deleteTeam 
} = require('../controllers/teamController');
const protect = require('../middleware/authMiddleware')
const authorizeAdmin = require('../middleware/authorizeAdmin')
const router = express.Router();

router.post('/create',protect,authorizeAdmin,createTeam);
router.get('/all', getAllTeams);
router.get('/:id', getTeamById);
router.put('/update/:id',authorizeAdmin,updateTeam);
router.delete('/delete/:id',authorizeAdmin,deleteTeam);

module.exports = router;