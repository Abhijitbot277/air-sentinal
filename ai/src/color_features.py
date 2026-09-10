"""Lightweight color feature extraction for AIR SENTINAL.

This module intentionally contains measurement-independent mathematics only.
It does not claim to convert RGB values into H2S concentration.
"""

from __future__ import annotations

import colorsys
from math import sqrt
from typing import Mapping


def extract_features(rgb: Mapping[str, float]) -> dict[str, float]:
    """Return normalized RGB, HSV, luminance and simple color features.

    Input channels are expected on a 0-255 scale. Values are clipped so the
    function remains robust to small upstream capture errors.
    """
    r = max(0.0, min(255.0, float(rgb["r"])))
    g = max(0.0, min(255.0, float(rgb["g"])))
    b = max(0.0, min(255.0, float(rgb["b"])))

    rn, gn, bn = r / 255.0, g / 255.0, b / 255.0
    h, s, v = colorsys.rgb_to_hsv(rn, gn, bn)
    luminance = 0.2126 * rn + 0.7152 * gn + 0.0722 * bn

    return {
        "r_norm": rn,
        "g_norm": gn,
        "b_norm": bn,
        "h": h,
        "s": s,
        "v": v,
        "luminance": luminance,
        "rg_ratio": rn / max(gn, 1e-9),
        "gb_ratio": gn / max(bn, 1e-9),
        "color_distance_from_gray": sqrt(
            ((rn - luminance) ** 2 + (gn - luminance) ** 2 + (bn - luminance) ** 2)
        ),
    }


if __name__ == "__main__":
    print(extract_features({"r": 120, "g": 80, "b": 50}))
