# AIR SENTINAL — ESP32-C3 Wristband Firmware

This folder contains a reference firmware implementation for an ESP32-C3 wristband prototype.

## What it does

1. Starts the ADC input used by the prototype colorimetric sensing/readout circuit.
2. Identifies the worker and wristband.
3. Reads a raw sensor value every 5 seconds.
4. Converts that raw value into a **prototype response index (0–100)**.
5. Assigns `SAFE`, `UNKNOWN`, or `ALERT` using demo-only thresholds.
6. Sends a JSON sample over Bluetooth Low Energy (BLE).
7. Prints the same sample to Serial Monitor.
8. Drives a local status LED.

## Dashboard connection

The GitHub Pages dashboard can connect to the wristband from a browser that supports Web Bluetooth, such as Chrome/Edge on a compatible desktop. The dashboard and firmware use these UUIDs:

```text
Service:        7b2a0001-6c4a-4d3b-9c1f-4153454e544c
Characteristic: 7b2a0002-6c4a-4d3b-9c1f-4153454e544c
```

The characteristic sends JSON such as:

```json
{
  "event_id": "AS-12",
  "worker_id": "AS-024",
  "wristband_id": "WB-024",
  "response_index": 62,
  "sensor_raw": 2540,
  "status": "UNKNOWN",
  "source": "WRISTBAND",
  "device_uptime_ms": 60000
}
```

## Arduino IDE

Select an ESP32-C3 board, install the Espressif ESP32 board package, and upload `src/main.cpp` as the sketch source. The BLE classes used here are included with the ESP32 Arduino core.

Change these values for the actual prototype:

- `SENSOR_PIN`
- `STATUS_LED_PIN`
- `WORKER_ID`
- `WRISTBAND_ID`
- BLE device name if required

## Important validation note

The `0–100` response index is a software abstraction for prototype testing. The ADC-to-response mapping and `SAFE_RESPONSE_MAX` / `ALERT_RESPONSE_MIN` values are **not H₂S safety limits** and must not be treated as validated gas concentration thresholds. Final interpretation must come from controlled measurements of the actual colorimetric sensing system.

The web dashboard stores received/simulated samples in the browser's `localStorage`; it is a demo database, not a cloud database.
