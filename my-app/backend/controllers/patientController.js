const { Patient } = require('../models');

exports.createPatient = async (req, res) => {
  const patient = await Patient.create(req.body);
  req.app.io.emit('patientCreated', patient);
  res.status(201).json(patient);
};

exports.getPatients = async (req, res) => {
  const patients = await Patient.findAll();
  res.status(200).json(patients);
};
