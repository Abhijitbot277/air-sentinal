# AIR SENTINAL — AI / Color Analysis Plan

## Objective

The software analysis layer will investigate whether the visual response of the passive colorimetric sensing element contains enough repeatable information to classify experimental states.

The initial implementation should be based on measurable image features before introducing a complex neural network.

## Proposed pipeline

```text
IMAGE
  │
  ▼
ROI SELECTION
  │
  ▼
LIGHTING / WHITE-BALANCE NORMALIZATION
  │
  ▼
COLOR FEATURES
  ├── R, G, B
  ├── HSV
  ├── normalized RGB
  └── color-difference features
  │
  ▼
FEATURE QUALITY CHECK
  │
  ▼
CLASSIFIER / RULE MODEL
  │
  ├── SAFE
  ├── ALERT
  └── UNKNOWN
  │
  ▼
EVENT + CONFIDENCE
```

## Why start with color features?

A colorimetric sensing element produces a visual response. Simple, interpretable features make it easier to inspect the physical response, detect lighting problems, and understand whether the proposed sensing principle is promising before training a larger model.

## Experimental dataset requirements

The eventual dataset should contain repeated measurements across controlled conditions and should record:

- sample identifier
- worker/wristband identifier where applicable
- sensing material/experimental class
- image or extracted features
- timestamp
- lighting condition
- temperature and humidity when available
- experimental reference condition

## Model evaluation

After sufficient measured data are collected, the project can evaluate suitable classifiers such as logistic regression, random forest, support vector machines, or a small neural network.

Evaluation should use a held-out test set or an appropriate cross-validation strategy. Report only metrics calculated from actual measurements.

Potential metrics include:

- accuracy
- precision
- recall
- F1 score
- confusion matrix
- inference time

## Current status

**Planning / experimental validation required.**

No trained AI model or validated classification accuracy is claimed by this repository at this stage.

## Safety note

Software classification must never be used as the sole basis for real-world H₂S safety decisions until the complete sensing system has been experimentally validated and independently assessed against appropriate safety requirements.
