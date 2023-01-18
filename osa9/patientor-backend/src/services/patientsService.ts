import patientsData from '../../data/patients.json';
import { v1 as uuid } from 'uuid';

import { Patient, NonSensitivePatient, NewPatient } from '../types';
import { toNewPatient } from '../utils';

const patients: Patient[] = patientsData.map(obj => {
  const patient = toNewPatient(obj) as Patient;
  patient.id = obj.id;
  return patient;
});

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id, name, dateOfBirth, gender, occupation
  }));
};

const addPatient = (newPatient: NewPatient): Patient => {
  const patient = {
    id: uuid(),
    ...newPatient
  };

  patients.push(patient);
  return patient;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient
};
