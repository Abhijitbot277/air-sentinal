import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from color_features import extract_features
from quality import validate_rgb
from classifier import classify


def test_rgb_validation():
    ok, errors = validate_rgb({"r": 10, "g": 20, "b": 30})
    assert ok
    assert errors == []


def test_feature_extraction():
    features = extract_features({"r": 120, "g": 80, "b": 50})
    assert 0 <= features["r_norm"] <= 1
    assert 0 <= features["g_norm"] <= 1
    assert 0 <= features["b_norm"] <= 1
    assert 0 <= features["h"] <= 1
    assert 0 <= features["s"] <= 1
    assert 0 <= features["v"] <= 1


def test_classifier_is_conservative_before_validation():
    features = extract_features({"r": 120, "g": 80, "b": 50})
    result = classify(features)
    assert result["status"] == "UNKNOWN"
    assert result["confidence"] is None
