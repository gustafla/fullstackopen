import patientsData from '../../data/patients';
import { v1 as uuid } from 'uuid';

import { Patient, PublicPatient, NewPatient, Entry, NewEntry } from '../types';

const patients: Patient[] = patientsData;

const getEntries = (): Patient[] => {
  return patients;
};

const getPublicEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id, name, dateOfBirth, gender, occupation
  }));
};

const findById = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = (newPatient: NewPatient): Patient => {
  const patient = {
    id: uuid(),
    entries: [],
    ...newPatient
  };

  patients.push(patient);
  return patient;
};

const addEntry = (patientId: Patient['id'], newEntry: NewEntry): Entry | undefined => {
  const entry = {
    id: uuid(),
    ...newEntry
  };

  const patient = findById(patientId);

  if (!patient) {
    return undefined;
  }

  patient.entries.push(entry);
  return entry;
};

export default {
  getEntries,
  getPublicEntries,
  findById,
  addPatient,
  addEntry,
};
