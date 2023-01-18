import express from 'express';
import diagnosesService from '../services/diagnosesService';

const router = express.Router();

router.get('/', (_req, res) => {
  console.log('Fetching all diagnoses!');
  const diags = diagnosesService.getEntries();
  res.json(diags);
});

router.post('/', (_req, _res) => {
  console.log('Saving a dignosis!');
});

export default router;
