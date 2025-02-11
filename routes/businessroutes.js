const express = require('express');
const protect = require('../middleware/authMiddleware');

const {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  getclientServiceAndDate,
  getclientById,
  updateBusiness,
  deleteBusiness,
} = require('../controllers/businesscontroller');

const router = express.Router();

router.post('/create', protect,createBusiness);
router.get('/allprofiles',protect, getAllBusinesses); 
router.get('/getbyid/:id', protect, getBusinessById);
router.get('/getthree',getclientServiceAndDate);
router.get('/getthree/:id',getclientById);
router.put('/update/:id', protect, updateBusiness);
router.delete('/delete/:id', protect, deleteBusiness);
module.exports = router;