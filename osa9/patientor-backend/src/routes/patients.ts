import express from 'express';
import patientsService from '../services/patientsService';
import { toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  console.log('Fetching all patients!');
  const patients = patientsService.getNonSensitiveEntries();
  res.json(patients);
});

router.post('/', (req, res) => {
  console.log('Adding new patient!');
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newPatient = toNewPatient(req.body);
    const patient = patientsService.addPatient(newPatient);
    res.json(patient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' ' + error.message;
    }
    res.status(400).json({ error: errorMessage });
  }
});

export default router;
