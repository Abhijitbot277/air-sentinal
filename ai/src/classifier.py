"""Prototype interpretation layer for AIR SENTINAL.

The default classifier deliberately returns UNKNOWN because no validated
experimental threshold/model is available yet. A measured model can replace
this module after controlled experiments.
"""

from __future__ import annotations

from typing import Mapping


def classify(features: Mapping[str, float]) -> dict[str, object]:
    """Return a conservative prototype classification.

    Until experimentally validated thresholds or a trained model are supplied,
    every structurally valid sample remains UNKNOWN.
    """
    required = ("r_norm", "g_norm", "b_norm", "h", "s", "v")
    if any(key not in features for key in required):
        return {
            "status": "UNKNOWN",
            "confidence": None,
            "reason": "incomplete feature vector",
        }

    return {
        "status": "UNKNOWN",
        "confidence": None,
        "reason": "validated sensing model not configured",
    }
