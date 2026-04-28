const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.put('/inventory', verifyToken, checkRole(['HOSPITAL']), hospitalController.updateInventory);
router.post('/update-inventory-public', hospitalController.updateInventoryPublic);
router.get('/', hospitalController.getAllHospitals);

module.exports = router;
