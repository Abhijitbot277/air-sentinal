# AIR SENTINAL — End-to-End Data Flow

## Overview

AIR SENTINAL separates sensing, interpretation, communication, and safety-dashboard functions so each layer can be tested independently.

```text
WORKER
  │
  ▼
SMART WRISTBAND
  ├── Worker ID
  ├── Wristband ID
  └── Passive colorimetric sensing element
          │
          ▼
   OPTICAL READER
          │
          ▼
   FEATURE EXTRACTION
   ├── RGB / color features
   ├── normalized response
   └── environmental metadata
          │
          ▼
   INTERPRETATION LAYER
   ├── SAFE
   ├── ALERT
   └── UNKNOWN
          │
          ▼
      WIRELESS LINK
          │
          ▼
   CONTROL COMPUTER
   ├── event logging
   ├── worker records
   ├── exposure history
   └── health / attendance records
          │
          ▼
    SAFETY DASHBOARD
          │
     ┌────┴────┐
     ▼         ▼
   ALERT     HISTORY
```

## Event lifecycle

1. The wearable is associated with a unique Worker ID and Wristband ID.
2. A sensing response is captured by the optical measurement layer.
3. The raw response is converted into reproducible features.
4. The interpretation layer assigns a state using experimentally determined rules/model outputs.
5. The event is timestamped.
6. The event is transmitted to the control computer.
7. The dashboard updates the worker status and event history.
8. If the state is `ALERT`, the system presents a visible warning for the safety workflow.

## Health and attendance

Health and attendance information is kept logically separate from the sensing measurement. This allows the system to associate an event with a worker without treating health information as evidence of H₂S concentration.

The current browser demo uses clearly labeled demonstration data for these fields.

## Failure handling

| Failure | System behavior |
|---|---|
| Worker ID missing | Do not attribute event to a worker; show error/unknown state |
| Optical sample invalid | Mark sample `UNKNOWN` |
| Wireless connection lost | Queue/retry event where supported |
| Uncertain classification | Use `UNKNOWN`, not `ALERT` or `SAFE` by assumption |
| Dashboard unavailable | Preserve local event data where the final hardware design supports it |

## Validation boundary

This architecture describes the intended system flow. It does not establish that the sensing method can reliably measure H₂S or distinguish exposure levels. Those properties require controlled experimental validation.
