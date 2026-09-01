import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { LOCAL_PATTERN_SUMMARY_SCHEMA, LOCAL_EVIDENCE_RECORD_SCHEMA } from './schemas.js';

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

const validateSubmission = ajv.compile(LOCAL_PATTERN_SUMMARY_SCHEMA);
const validateLocalEvidenceRecord = ajv.compile(LOCAL_EVIDENCE_RECORD_SCHEMA);

function runValidator(validator, payload) {
  const valid = validator(payload);
  return { valid, errors: valid ? [] : (validator.errors ?? []) };
}

export function validateLocalPatternSummary(payload) {
  return runValidator(validateSubmission, payload);
}

export function validateLocalEvidence(payload) {
  return runValidator(validateLocalEvidenceRecord, payload);
}
