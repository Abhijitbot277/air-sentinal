# AIR SENTINAL — System Architecture

## Objective

AIR SENTINAL is a prototype architecture for worker-level H₂S exposure monitoring. It connects a wearable sensing layer to a central monitoring interface so that an exposure response can be associated with a specific worker.

## Architecture

```text
┌─────────────────────┐
│       WORKER        │
│     AS-024          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────┐
│      SMART WRISTBAND        │
│                             │
│  • Worker ID                │
│  • Passive colorimetric     │
│    H₂S sensing element      │
│  • Local sensing/reading    │
└────────────┬────────────────┘
             │
             │ wireless link
             ▼
┌─────────────────────────────┐
│      CONTROL COMPUTER       │
│                             │
│  • Worker identification    │
│  • Response interpretation  │
│  • Event logging            │
│  • Health/attendance record │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│       SAFETY DASHBOARD      │
│                             │
│  SAFE / ALERT               │
│  Exposure history           │
│  Worker status              │
│  Health & attendance        │
└─────────────────────────────┘
```

## Sensing concept

The sensing layer is intended to use a passive colorimetric response to H₂S. A camera or optical reading stage can capture the resulting color change, after which image-processing methods can extract features such as color-channel values or color-space coordinates.

The exact sensing chemistry, response characteristics, selectivity, calibration and detection limit remain experimental work and must be validated before performance claims are made.

## Data flow

1. A worker wears a wristband with a unique Worker ID.
2. The sensing element is exposed to the surrounding environment.
3. A colorimetric response is captured/read.
4. The response is associated with the Worker ID.
5. Data are transmitted to the monitoring computer.
6. The dashboard records the event and can generate an alert.
7. Historical worker-level events can be reviewed by safety personnel.

## Prototype boundary

The current browser dashboard demonstrates the software workflow using simulated events. It does not claim that the physical H₂S sensor, wireless link, or AI classifier is already experimentally validated.
