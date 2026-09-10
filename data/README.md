# AIR SENTINAL — Data Specification

This folder defines the data structure for experimental H₂S colorimetric sensing and software testing.

## Dataset record

Recommended fields:

| Field | Description |
|---|---|
| `timestamp` | Time of measurement |
| `worker_id` | Unique worker identifier |
| `wristband_id` | Unique wearable identifier |
| `sample_id` | Unique measurement/sample identifier |
| `lighting_condition` | Controlled lighting description |
| `temperature_c` | Measured temperature, if available |
| `humidity_pct` | Measured relative humidity, if available |
| `color_r` | Measured red channel/value |
| `color_g` | Measured green channel/value |
| `color_b` | Measured blue channel/value |
| `response_index` | Derived sensing-response feature |
| `response_label` | Experimental label assigned from the protocol |

## Directory structure

```text
data/
├── README.md
├── raw/
│   └── README.md
└── processed/
    └── README.md
```

## Data integrity rules

- Raw measurements should be preserved without overwriting them.
- Processing steps should be documented so derived values can be reproduced.
- Calibration/reference samples should be identified separately from test samples.
- Missing measurements should remain missing rather than being replaced by invented values.
- Any demo/simulated dataset must be explicitly labeled `SIMULATED`.

## Experimental validation

The project will use controlled measurements to determine whether PLA, PE, PP, and PET produce sufficiently distinguishable responses for classification. Dataset size, accuracy, precision, recall, confusion matrices, detection limits, and response time are **to be measured** and must not be fabricated in documentation or presentations.

## Safety

Do not create an H₂S dataset using uncontrolled exposure. Chemical experiments require an appropriate controlled laboratory setup and institutional safety procedures.
