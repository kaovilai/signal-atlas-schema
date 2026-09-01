export type DayType = 'weekday' | 'weekend';
export type Movement = 'through' | 'left' | 'right';
export type EligibilityState = 'private' | 'candidate' | 'volatile';
export type Verdict = 'likely_signal_pattern' | 'not_signal' | 'volatile_adaptive';
export type Action = 'private' | 'insight_only' | 'offer_confirm' | 'offer_contribute';

export interface Context {
  day_type: DayType;
  time_bucket_local: string;
  timezone: string;
}

export interface Evidence {
  qualifying_passes: number;
  inferred_stops: number;
  continuous_passes: number;
  wait_seconds_p50: number;
  wait_seconds_p90: number;
  observed_on_distinct_days: number;
  first_observed_date: string;
  last_observed_date: string;
  median_gps_accuracy_m: number;
  mean_map_match_confidence: number;
}

export interface UserConfirmation {
  confirmed_at: string;
  verdict: Verdict;
}

export interface LocalPatternSummary {
  schema_version: 1;
  submission_id: string;
  kind: 'local_pattern_summary';
  intersection_id: string;
  approach_id: string;
  movement: Movement;
  context: Context;
  evidence: Evidence;
  user_confirmation: UserConfirmation;
}

export interface LocalEvidenceKey {
  intersection_id: string;
  approach_id: string;
  movement: Movement;
  day_type: DayType;
  time_bucket_local: string;
}

export interface LocalEvidenceRecord {
  key: LocalEvidenceKey;
  local_evidence: {
    passes: number;
    stops: number;
    continuous_passes: number;
    wait_seconds: number[];
    median_gps_accuracy_m: number;
    mean_map_match_confidence: number;
    first_seen_at: string;
    last_seen_at: string;
  };
  upload_eligibility: {
    state: EligibilityState;
    reasons: string[];
  };
}

export interface ConfidenceInputs {
  N: number;
  Qgps: number;
  Qmap: number;
  Qrepeat: number;
}

export function computeConfidenceScore(inputs: ConfidenceInputs): number;
export function classifyScore(S: number, opts?: { isVolatile?: boolean }): Action;

export interface ValidationResult {
  valid: boolean;
  errors: unknown[];
}

export function validateLocalPatternSummary(payload: unknown): ValidationResult;
export function validateLocalEvidence(payload: unknown): ValidationResult;
