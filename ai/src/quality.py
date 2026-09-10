"""Measurement-quality checks for AIR SENTINAL."""

from __future__ import annotations


def validate_rgb(rgb: dict[str, float]) -> tuple[bool, list[str]]:
    """Check whether an RGB sample is structurally usable.

    This is only a data-quality check; it does not validate H2S sensing.
    """
    errors: list[str] = []
    for channel in ("r", "g", "b"):
        if channel not in rgb:
            errors.append(f"missing channel: {channel}")
            continue
        try:
            value = float(rgb[channel])
        except (TypeError, ValueError):
            errors.append(f"non-numeric channel: {channel}")
            continue
        if not 0 <= value <= 255:
            errors.append(f"channel outside 0-255 range: {channel}")

    return not errors, errors
