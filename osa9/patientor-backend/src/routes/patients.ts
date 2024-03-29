import express from 'express';
import patientsService from '../services/patientsService';
import { toNewPatient, toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  console.log('Fetching all patients!');
  const patients = patientsService.getPublicEntries();
  res.json(patients);
});

router.get('/:id', (req, res) => {
  const patient = patientsService.findById(req.params.id);

  if (patient) {
    res.json(patient);
  } else {
    res.sendStatus(404);
  }
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

router.post('/:id/entries', (req, res) => {
  console.log('Adding a new patient entry');

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newEntry = toNewEntry(req.body);
    const entry = patientsService.addEntry(req.params.id, newEntry);

    if (!entry) {
      res.sendStatus(404);
    }

    res.json(entry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' ' + error.message;
    }
    res.status(400).json({ error: errorMessage });
  }
});

export default router;
