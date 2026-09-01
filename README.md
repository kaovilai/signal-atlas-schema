# signal-atlas-schema

Shared JSON Schema, TypeScript types, and confidence-score logic for [Signal Atlas](../signal-atlas-app).

Consumed by both `signal-atlas-app` (client-side validation before building a submission)
and `signal-atlas-data` (the GitHub Action's server-side validation).

## Exports

- `LOCAL_PATTERN_SUMMARY_SCHEMA`, `LOCAL_EVIDENCE_RECORD_SCHEMA` — JSON Schemas.
- `computeConfidenceScore({ N, Qgps, Qmap, Qrepeat })` — `S = 0.30*min(N/5,1) + 0.25*Qgps + 0.25*Qmap + 0.20*Qrepeat`.
- `classifyScore(S, { isVolatile })` — maps a score to `'private' | 'insight_only' | 'offer_confirm' | 'offer_contribute'`.
- `validateLocalPatternSummary(payload)`, `validateLocalEvidence(payload)` — ajv-backed validators.

## Usage from another repo (private, pre-npm-publish)

```json
"dependencies": {
  "signal-atlas-schema": "github:kaovilai/signal-atlas-schema#main"
}
```

## Test

```sh
npm install
npm test
```
