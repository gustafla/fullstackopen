import express from 'express';
import patientsService from '../services/patientsService';

const router = express.Router();

router.get('/', (_req, res) => {
  console.log('Fetching all patients!');
  const patients = patientsService.getNonSensitiveEntries();
  res.json(patients);
});

router.post('/', (_req, _res) => {
  console.log('Saving a patient!');
});

export default router;
