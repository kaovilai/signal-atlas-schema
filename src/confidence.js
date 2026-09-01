// Confidence-score formula and action classification, per the design doc:
// S = 0.30 * min(N/5, 1) + 0.25 * Qgps + 0.25 * Qmap + 0.20 * Qrepeat

export function computeConfidenceScore({ N, Qgps, Qmap, Qrepeat }) {
  if (![N, Qgps, Qmap, Qrepeat].every((v) => typeof v === 'number' && Number.isFinite(v))) {
    throw new TypeError('computeConfidenceScore requires numeric N, Qgps, Qmap, Qrepeat');
  }
  const repeatTerm = Math.min(N / 5, 1);
  return 0.30 * repeatTerm + 0.25 * Qgps + 0.25 * Qmap + 0.20 * Qrepeat;
}

export const ACTION = Object.freeze({
  PRIVATE: 'private',
  INSIGHT_ONLY: 'insight_only',
  OFFER_CONFIRM: 'offer_confirm',
  OFFER_CONTRIBUTE: 'offer_contribute'
});

// isVolatile: caller-computed signal that stop/go outcomes disagree across
// passes (e.g. classification isn't consistent in a meaningful share of them).
// The doc treats this as an override, not a score band.
export function classifyScore(S, { isVolatile = false } = {}) {
  if (isVolatile) return ACTION.INSIGHT_ONLY;
  if (S < 0.50) return ACTION.PRIVATE;
  if (S < 0.70) return ACTION.INSIGHT_ONLY;
  if (S < 0.85) return ACTION.OFFER_CONFIRM;
  return ACTION.OFFER_CONTRIBUTE;
}
