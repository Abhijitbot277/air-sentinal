# AIR SENTINAL — AI Analysis Layer

The `ai/` layer contains the software-side analysis pipeline for the passive colorimetric sensing concept.

## Pipeline

```text
IMAGE / SENSOR RESPONSE
        ↓
   ROI EXTRACTION
        ↓
  COLOR FEATURES
        ↓
 NORMALIZATION / QC
        ↓
 CLASSIFICATION MODEL
        ↓
 SAFE / ALERT / UNKNOWN
        ↓
 EVENT JSON
```

## Design principle

Start with interpretable color features and a lightweight classifier. Move to a neural model only if measured data show that it provides a meaningful improvement.

## Current status

The repository does not claim a trained or validated H₂S classifier yet. Training and evaluation require real measurements collected under a controlled experimental protocol.

Demo/simulated values must always be labeled as simulated.

## Planned modules

```text
ai/
├── README.md
├── schemas/
│   └── event-schema.json
├── src/
│   ├── color_features.py
│   ├── quality.py
│   └── classifier.py
└── tests/
```
