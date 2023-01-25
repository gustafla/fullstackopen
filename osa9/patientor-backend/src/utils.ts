import { NewPatient, Gender, Entry } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isIterable = (field: any): field is Iterable<unknown> => {
  return Symbol.iterator in field;
};

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

const parseEntries = (field: unknown, fieldName: string): Entry[] => {
  if (!field) {
    throw new Error('Missing field: ' + fieldName);
  }

  if (!isIterable(field)) {
    throw new Error('Invalid field: ' + fieldName);
  }

  for (const obj of field) {
    const entry = obj as Entry | undefined;
    switch (entry?.type) {
      case 'Hospital':
      case 'OccupationalHealthcare':
      case 'HealthCheck':
        break;
      default:
        throw new Error('Invalid field: ' + fieldName);
    }
  }

  return field as Entry[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation, entries }: any): NewPatient => {
  const newPatient: NewPatient = {
    name: parseString(name, 'name'),
    dateOfBirth: parseDate(dateOfBirth, 'dateOfBirth'),
    ssn: parseString(ssn, 'ssn'),
    gender: parseGender(gender, 'gender'),
    occupation: parseString(occupation, 'occupation'),
    entries: parseEntries(entries, 'entries'),
  };

  return newPatient;
};
