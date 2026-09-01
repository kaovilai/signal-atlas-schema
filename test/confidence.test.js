import test from 'node:test';
import assert from 'node:assert/strict';
import { computeConfidenceScore, classifyScore, ACTION } from '../src/confidence.js';

test('computeConfidenceScore matches the formula at known inputs', () => {
  // S = 0.30*min(N/5,1) + 0.25*Qgps + 0.25*Qmap + 0.20*Qrepeat
  const S = computeConfidenceScore({ N: 5, Qgps: 1, Qmap: 1, Qrepeat: 1 });
  assert.equal(S, 1);

  const zero = computeConfidenceScore({ N: 0, Qgps: 0, Qmap: 0, Qrepeat: 0 });
  assert.equal(zero, 0);

  // N caps at 5 passes worth of credit.
  const capped = computeConfidenceScore({ N: 10, Qgps: 1, Qmap: 1, Qrepeat: 1 });
  assert.equal(capped, 1);
});

test('classifyScore boundaries match the doc\'s illustrative table', () => {
  assert.equal(classifyScore(0.49), ACTION.PRIVATE);
  assert.equal(classifyScore(0.50), ACTION.INSIGHT_ONLY);
  assert.equal(classifyScore(0.69), ACTION.INSIGHT_ONLY);
  assert.equal(classifyScore(0.70), ACTION.OFFER_CONFIRM);
  assert.equal(classifyScore(0.84), ACTION.OFFER_CONFIRM);
  assert.equal(classifyScore(0.85), ACTION.OFFER_CONTRIBUTE);
  assert.equal(classifyScore(1), ACTION.OFFER_CONTRIBUTE);
});

test('classifyScore treats conflicting/volatile evidence as insight-only regardless of score', () => {
  assert.equal(classifyScore(0.95, { isVolatile: true }), ACTION.INSIGHT_ONLY);
});

test('computeConfidenceScore rejects non-numeric input', () => {
  assert.throws(() => computeConfidenceScore({ N: 'a', Qgps: 1, Qmap: 1, Qrepeat: 1 }), TypeError);
});
