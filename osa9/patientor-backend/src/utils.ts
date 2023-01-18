import { NewPatient, Gender } from './types';

const isString = (field: unknown): field is string => {
  return typeof field === 'string' || field instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (field: any): field is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(field);
};

const parseString = (field: unknown, fieldName: string): string => {
  if (!field) {
    throw new Error('Missing field: ' + fieldName);
  }

  if (!isString(field)) {
    throw new Error('Incorrect field: ' + fieldName);
  }

  return field;
};

const parseDate = (field: unknown, fieldName: string): string => {
  const string = parseString(field, fieldName);

  if (!isDate(string)) {
    throw new Error('Incorrect field: ' + fieldName);
  }

  return string;
};

const parseGender = (field: unknown, fieldName: string): Gender => {
  const string = parseString(field, fieldName);

  if (!isGender(string)) {
    throw new Error('Incorrect field: ' + fieldName);
  }

  return string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation }: any): NewPatient => {
  const newPatient: NewPatient = {
    name: parseString(name, 'name'),
    dateOfBirth: parseDate(dateOfBirth, 'dateOfBirth'),
    ssn: parseString(ssn, 'ssn'),
    gender: parseGender(gender, 'gender'),
    occupation: parseString(occupation, 'occupation'),
  };

  return newPatient;
};
