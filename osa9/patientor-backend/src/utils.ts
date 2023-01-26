import { NewPatient, Gender, NewEntry, NewBaseEntry, HealthCheckRating } from './types';

const isString = (field: unknown): field is string => {
  return typeof field === 'string' || field instanceof String;
};

const isStringArray = (field: unknown): field is string[] => {
  return Array.isArray(field) && field.every((str) => isString(str));
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (field: any): field is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(field);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (field: any): field is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(field);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseStringArray = (field: any, fieldName: string): string[] => {
  if (!field) {
    throw new Error('Missing field: ' + fieldName);
  }

  if (!isStringArray(field)) {
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

const parseHealthCheckRating = (field: unknown, fieldName: string): HealthCheckRating => {
  if (!isHealthCheckRating(field)) {
    throw new Error('Incorrect field: ' + fieldName);
  }

  return field;
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

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled type: ${JSON.stringify(value)}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseBaseEntry = ({ description, date, specialist, diagnosisCodes }: any): NewBaseEntry => {
  return {
    description: parseString(description, 'description'),
    date: parseDate(date, 'date'),
    specialist: parseString(specialist, 'specialist'),
    diagnosisCodes: diagnosisCodes ? parseStringArray(diagnosisCodes, 'diagnosisCodes') : undefined,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseHealthCheckEntry = ({ description, date, specialist, diagnosisCodes, healthCheckRating }: any): NewEntry => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ...parseBaseEntry({ description, date, specialist, diagnosisCodes }),
    type: 'HealthCheck',
    healthCheckRating: parseHealthCheckRating(healthCheckRating, 'healthCheckRating'),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseHospitalEntry = ({ description, date, specialist, diagnosisCodes, discharge }: any): NewEntry => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ...parseBaseEntry({ description, date, specialist, diagnosisCodes }),
    type: 'Hospital',
    discharge: {
      date: parseString(discharge?.date, 'discharge'),
      criteria: parseString(discharge?.criteria, 'discharge')
    }
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseOccupationalHealthcareEntry = ({ description, date, specialist, diagnosisCodes, employerName, sickLeave }: any): NewEntry => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ...parseBaseEntry({ description, date, specialist, diagnosisCodes }),
    type: 'OccupationalHealthcare',
    employerName: parseString(employerName, 'employerName'),
    sickLeave: sickLeave ? {
      startDate: parseDate(sickLeave.startDate, 'sickLeave'),
      endDate: parseDate(sickLeave.endDate, 'sickLeave')
    } : undefined,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewEntry = (obj: any): NewEntry => {
  const type = parseString(obj.type, 'type');

  switch (type) {
    case "HealthCheck":
      return parseHealthCheckEntry(obj);
    case "Hospital":
      return parseHospitalEntry(obj);
    case "OccupationalHealthcare":
      return parseOccupationalHealthcareEntry(obj);
    default:
      throw new Error(`Unhandled entry type: ${type}`);
  }
};
