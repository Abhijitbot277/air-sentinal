# AIR SENTINAL — Circuit & Wiring Plan

## Purpose

This document defines the prototype-level electrical architecture for AIR SENTINAL. It is a wiring and interface plan, not a certified safety-instrumentation design.

## System blocks

```text
                 ┌──────────────────────────┐
                 │     POWER / BATTERY      │
                 └────────────┬─────────────┘
                              │
                    ┌─────────▼─────────┐
                    │ MICROCONTROLLER    │
                    │                    │
                    │ Worker ID          │
                    │ Sensor processing  │
                    │ Communication      │
                    └─────┬──────┬──────┘
                          │      │
             ┌────────────┘      └──────────────┐
             ▼                                  ▼
   ┌──────────────────┐                ┌─────────────────┐
   │ OPTICAL / IMAGE  │                │ WIRELESS LINK   │
   │ READER INTERFACE │                │ BLE / Wi-Fi*    │
   └──────────────────┘                └────────┬────────┘
                                                │
                                                ▼
                                      ┌──────────────────┐
                                      │ CONTROL COMPUTER │
                                      └────────┬─────────┘
                                               ▼
                                      SAFETY DASHBOARD

   STATUS OUTPUTS: LED / VIBRATION / BUZZER (prototype option)
```

`*` The final wireless technology will be selected during prototype testing.

## Interface plan

| Block | Prototype role | MCU interface |
|---|---|---|
| Worker ID | Unique worker/wristband identification | GPIO / NFC / BLE identifier |
| Colorimetric sensing element | Passive H₂S response element | Optical reader/camera path |
| Optical reader | Captures the sensing response | Camera, USB, or digital interface |
| Wireless module | Sends worker/event data | UART / SPI / BLE / Wi-Fi, depending on hardware |
| Status indicator | Local warning/status | GPIO |
| Power | Supplies electronics | Regulated power input |

## Example data packet

```text
worker_id=AS-024
wristband_id=WB-024
event_id=EVT-0001
response_index=<measured_value>
timestamp=<device_timestamp>
status=<SAFE|ALERT|UNKNOWN>
```

`<measured_value>` must come from an actual measurement in the experimental prototype. Do not replace it with a fabricated sensor value and present it as real data.

## Prototype design principles

1. Keep the sensing element physically isolated from electronics where practical.
2. Keep the optical measurement geometry repeatable between samples.
3. Record lighting and environmental conditions during experiments.
4. Use a unique Worker ID independently from the measured response.
5. Send timestamped events to the central computer.
6. Treat `UNKNOWN` as a valid state when the measurement is outside the validated operating range.

## Safety boundary

H₂S is highly hazardous. Do not generate, release, or test H₂S using an improvised circuit, container, or room setup. Any chemical sensing validation must use an appropriate controlled laboratory setup, suitable monitoring, ventilation, PPE, and institutional safety procedures.

The dashboard demonstration uses simulated exposure events and is not a substitute for a certified gas detector or safety system.
