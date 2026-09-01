// JSON Schema definitions for Signal Atlas payloads.
// Field shapes mirror the design doc's local_pattern_summary example exactly.

export const CONTEXT_SCHEMA = {
  $id: 'signal-atlas/context',
  type: 'object',
  additionalProperties: false,
  required: ['day_type', 'time_bucket_local', 'timezone'],
  properties: {
    day_type: { enum: ['weekday', 'weekend'] },
    time_bucket_local: { type: 'string', pattern: '^([01]\\d|2[0-3]):[0-5]\\d-([01]\\d|2[0-3]):[0-5]\\d$' },
    timezone: { type: 'string', minLength: 1 }
  }
};

export const EVIDENCE_SCHEMA = {
  $id: 'signal-atlas/evidence',
  type: 'object',
  additionalProperties: false,
  required: [
    'qualifying_passes', 'inferred_stops', 'continuous_passes',
    'wait_seconds_p50', 'wait_seconds_p90', 'observed_on_distinct_days',
    'first_observed_date', 'last_observed_date',
    'median_gps_accuracy_m', 'mean_map_match_confidence'
  ],
  properties: {
    qualifying_passes: { type: 'integer', minimum: 1, maximum: 10000 },
    inferred_stops: { type: 'integer', minimum: 0, maximum: 10000 },
    continuous_passes: { type: 'integer', minimum: 0, maximum: 10000 },
    wait_seconds_p50: { type: 'number', minimum: 0, maximum: 600 },
    wait_seconds_p90: { type: 'number', minimum: 0, maximum: 600 },
    observed_on_distinct_days: { type: 'integer', minimum: 1, maximum: 3650 },
    first_observed_date: { type: 'string', format: 'date' },
    last_observed_date: { type: 'string', format: 'date' },
    median_gps_accuracy_m: { type: 'number', minimum: 0, maximum: 1000 },
    mean_map_match_confidence: { type: 'number', minimum: 0, maximum: 1 }
  }
};

export const USER_CONFIRMATION_SCHEMA = {
  $id: 'signal-atlas/user_confirmation',
  type: 'object',
  additionalProperties: false,
  required: ['confirmed_at', 'verdict'],
  properties: {
    confirmed_at: { type: 'string', format: 'date-time' },
    verdict: { enum: ['likely_signal_pattern', 'not_signal', 'volatile_adaptive'] }
  }
};

// The payload submitted via the prefilled GitHub issue URL.
export const LOCAL_PATTERN_SUMMARY_SCHEMA = {
  $id: 'signal-atlas/local_pattern_summary',
  type: 'object',
  additionalProperties: false,
  required: [
    'schema_version', 'submission_id', 'kind',
    'intersection_id', 'approach_id', 'movement',
    'context', 'evidence', 'user_confirmation'
  ],
  properties: {
    schema_version: { const: 1 },
    submission_id: { type: 'string', format: 'uuid' },
    kind: { const: 'local_pattern_summary' },
    intersection_id: { type: 'string', minLength: 1, maxLength: 200 },
    approach_id: { type: 'string', minLength: 1, maxLength: 200 },
    movement: { enum: ['through', 'left', 'right'] },
    context: CONTEXT_SCHEMA,
    evidence: EVIDENCE_SCHEMA,
    user_confirmation: USER_CONFIRMATION_SCHEMA
  }
};

// Internal on-device aggregate (never leaves the device as-is).
export const LOCAL_EVIDENCE_KEY_SCHEMA = {
  $id: 'signal-atlas/local_evidence_key',
  type: 'object',
  additionalProperties: false,
  required: ['intersection_id', 'approach_id', 'movement', 'day_type', 'time_bucket_local'],
  properties: {
    intersection_id: { type: 'string', minLength: 1 },
    approach_id: { type: 'string', minLength: 1 },
    movement: { enum: ['through', 'left', 'right'] },
    day_type: { enum: ['weekday', 'weekend'] },
    time_bucket_local: { type: 'string' }
  }
};

export const LOCAL_EVIDENCE_RECORD_SCHEMA = {
  $id: 'signal-atlas/local_evidence_record',
  type: 'object',
  additionalProperties: false,
  required: ['key', 'local_evidence', 'upload_eligibility'],
  properties: {
    key: LOCAL_EVIDENCE_KEY_SCHEMA,
    local_evidence: {
      type: 'object',
      additionalProperties: false,
      required: [
        'passes', 'stops', 'continuous_passes', 'wait_seconds',
        'median_gps_accuracy_m', 'mean_map_match_confidence',
        'first_seen_at', 'last_seen_at'
      ],
      properties: {
        passes: { type: 'integer', minimum: 0 },
        stops: { type: 'integer', minimum: 0 },
        continuous_passes: { type: 'integer', minimum: 0 },
        wait_seconds: { type: 'array', items: { type: 'number', minimum: 0, maximum: 600 } },
        median_gps_accuracy_m: { type: 'number', minimum: 0 },
        mean_map_match_confidence: { type: 'number', minimum: 0, maximum: 1 },
        first_seen_at: { type: 'string', format: 'date-time' },
        last_seen_at: { type: 'string', format: 'date-time' }
      }
    },
    upload_eligibility: {
      type: 'object',
      additionalProperties: false,
      required: ['state', 'reasons'],
      properties: {
        state: { enum: ['private', 'candidate', 'volatile'] },
        reasons: { type: 'array', items: { type: 'string' } }
      }
    }
  }
};
