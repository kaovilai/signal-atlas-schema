import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLocalPatternSummary } from '../src/validate.js';

const validSubmission = {
  schema_version: 1,
  submission_id: '0198f4f1-3fa2-7a50-a0d6-1f4c7f9e34ae',
  kind: 'local_pattern_summary',
  intersection_id: 'sa:osm:node:123456789',
  approach_id: 'northbound-through',
  movement: 'through',
  context: {
    day_type: 'weekday',
    time_bucket_local: '17:00-17:30',
    timezone: 'America/New_York'
  },
  evidence: {
    qualifying_passes: 4,
    inferred_stops: 3,
    continuous_passes: 1,
    wait_seconds_p50: 26,
    wait_seconds_p90: 31,
    observed_on_distinct_days: 3,
    first_observed_date: '2026-08-19',
    last_observed_date: '2026-09-01',
    median_gps_accuracy_m: 6.2,
    mean_map_match_confidence: 0.92
  },
  user_confirmation: {
    confirmed_at: '2026-09-01T21:35:00Z',
    verdict: 'likely_signal_pattern'
  }
};

test('validateLocalPatternSummary accepts the doc\'s example payload', () => {
  const { valid, errors } = validateLocalPatternSummary(validSubmission);
  assert.equal(valid, true, JSON.stringify(errors));
});

test('validateLocalPatternSummary rejects a bad schema_version', () => {
  const { valid } = validateLocalPatternSummary({ ...validSubmission, schema_version: 2 });
  assert.equal(valid, false);
});

test('validateLocalPatternSummary rejects an out-of-range wait time', () => {
  const bad = { ...validSubmission, evidence: { ...validSubmission.evidence, wait_seconds_p90: 9999 } };
  const { valid } = validateLocalPatternSummary(bad);
  assert.equal(valid, false);
});

test('validateLocalPatternSummary rejects unknown extra fields', () => {
  const { valid } = validateLocalPatternSummary({ ...validSubmission, extra_field: 'nope' });
  assert.equal(valid, false);
});

test('validateLocalPatternSummary rejects a malformed submission_id', () => {
  const bad = { ...validSubmission, submission_id: 'not-a-uuid' };
  const { valid } = validateLocalPatternSummary(bad);
  assert.equal(valid, false);
});
