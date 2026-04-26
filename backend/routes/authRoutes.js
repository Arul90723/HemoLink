const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register/hospital', authController.registerHospital);
router.post('/register/donor', authController.registerDonor);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
