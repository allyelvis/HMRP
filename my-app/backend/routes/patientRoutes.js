const express = require('express');
const { createPatient, getPatients } = require('../controllers/patientController');
const router = express.Router();

router.post('/patients', createPatient);
router.get('/patients', getPatients);

module.exports = router;
