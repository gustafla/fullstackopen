import diagnosesData from '../../data/diagnoses.json';

import { Diagnose } from '../types';

const diagnoses: Diagnose[] = diagnosesData;

const getEntries = (): Diagnose[] => {
  return diagnoses;
};

const addDiagnosis = () => {
  return null;
};

export default {
  getEntries,
  addDiagnosis
};
