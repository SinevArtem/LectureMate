"""Image preparation, OCR and deterministic math checks."""
from __future__ import annotations

import base64
import io
import re
from dataclasses import dataclass

import cv2
import numpy as np
import sympy as sp
from PIL import Image

try:
    import pytesseract
except ImportError:  # OCR is optional when Qwen is the recognizer.
    pytesseract = None


@dataclass
class ArithmeticCheck:
    actual: str
    written: str
    correct: bool


def decode_image(data_url: str) -> Image.Image:
    encoded = data_url.split(',', 1)[-1]
    return Image.open(io.BytesIO(base64.b64decode(encoded))).convert('RGB')


def prepare_image(image: Image.Image) -> tuple[Image.Image, str]:
    """Improve contrast for OCR while preserving the original for vision."""
    rgb = np.array(image)
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    gray = cv2.resize(gray, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_CUBIC)
    clean = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 11)
    prepared = Image.fromarray(clean)
    output = io.BytesIO()
    prepared.save(output, format='PNG', optimize=True)
    return prepared, base64.b64encode(output.getvalue()).decode()


def ocr_text(image: Image.Image) -> list[str]:
    if pytesseract is None:
        return []
    prepared, _ = prepare_image(image)
    text = pytesseract.image_to_string(prepared, config='--psm 6')
    return [line.strip() for line in text.splitlines() if line.strip()]


def check_arithmetic(text: str) -> ArithmeticCheck | None:
    match = re.fullmatch(r'\s*(-?\d+(?:[.,]\d+)?)\s*([+\-*])\s*(-?\d+(?:[.,]\d+)?)\s*=\s*(-?\d+(?:[.,]\d+)?)\s*', text)
    if not match:
        return None
    left, operator, right, written = match.groups()
    left_n, right_n, written_n = (sp.Rational(value.replace(',', '.')) for value in (left, right, written))
    actual_n = { '+': left_n + right_n, '-': left_n - right_n, '*': left_n * right_n }[operator]
    return ArithmeticCheck(str(actual_n), str(written_n), actual_n == written_n)
