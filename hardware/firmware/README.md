# AIR SENTINAL — Firmware Architecture

## Goal

The firmware is responsible for identifying the wristband, collecting the optical sensing result, evaluating the current prototype state, and transmitting an event to the control computer.

## Device state machine

```text
BOOT
  │
  ▼
INITIALIZE
  │
  ├── Worker ID unavailable ──► ERROR
  │
  ▼
READY
  │
  ▼
CAPTURE RESPONSE
  │
  ▼
VALIDATE SAMPLE
  │
  ├── Invalid / insufficient data ──► UNKNOWN
  │
  ▼
INTERPRET RESPONSE
  │
  ├── below experimental threshold ──► SAFE
  ├── above experimental threshold ──► ALERT
  └── uncertain ─────────────────────► UNKNOWN
  │
  ▼
TRANSMIT EVENT
  │
  ▼
RETURN TO READY
```

## Firmware responsibilities

- Initialize the microcontroller and connected interfaces.
- Load or obtain the unique Worker/Wristband ID.
- Trigger or receive an optical measurement.
- Apply basic signal/color preprocessing.
- Reject incomplete or invalid samples.
- Assign a prototype state: `SAFE`, `ALERT`, or `UNKNOWN`.
- Attach a timestamp and event ID.
- Transmit the event to the control computer.
- Provide local status feedback when hardware supports it.

## Pseudocode

```text
setup()
    initialize_power()
    initialize_worker_id()
    initialize_optical_interface()
    initialize_wireless()
    initialize_status_output()

loop()
    sample = capture_response()

    if sample_is_invalid(sample):
        status = UNKNOWN
    else:
        features = preprocess(sample)
        status = interpret(features)

    event = create_event(
        worker_id,
        wristband_id,
        timestamp,
        features,
        status
    )

    transmit(event)
    update_local_indicator(status)
    wait_for_next_sample()
```

## Validation rule

The final interpretation thresholds must be determined from controlled experimental measurements. The repository must not hard-code an invented H₂S concentration, accuracy, detection limit, or classification performance and describe it as validated.

During early software development, simulated values may be used to test communication and dashboard behavior, but they must remain explicitly labeled as simulated.

## Planned firmware modules

```text
firmware/
├── README.md
├── src/
│   ├── main.*
│   ├── worker_id.*
│   ├── sensing.*
│   ├── signal_processing.*
│   ├── wireless.*
│   └── status.*
└── config/
    └── device_config.example.*
```

The actual MCU and language will be selected after the hardware prototype is finalized.
