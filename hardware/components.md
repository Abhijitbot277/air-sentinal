# AIR SENTINAL — Hardware Plan

This document defines the proposed prototype hardware. Component selection may change during experimental validation.

## Core hardware

| Block | Prototype role |
|---|---|
| Microcontroller | Reads local inputs and manages the wearable/control interface |
| Passive colorimetric H₂S sensing element | Produces a visible response intended to indicate H₂S exposure |
| Camera / optical reader | Captures the sensing element's color response |
| Wireless module | Transfers worker/event information to the monitoring computer |
| Worker ID | Unique identifier associated with the wristband |
| Battery / power module | Portable wearable power |
| Enclosure / wristband | Holds and protects the sensing and electronics assembly |

## Optional expansion

- Environmental temperature and humidity sensing
- Local status LED or vibration alert
- Central gateway
- Health-data interface
- Attendance reader/integration

## Engineering notes

The final component list should be selected after testing the sensing chemistry, optical response, power requirements, wireless range and enclosure constraints. H₂S is hazardous; physical exposure experiments must use an appropriate controlled laboratory setup, monitoring, ventilation and institutional safety procedures.

Do not test hazardous H₂S exposure in an improvised room or uncontrolled environment.
