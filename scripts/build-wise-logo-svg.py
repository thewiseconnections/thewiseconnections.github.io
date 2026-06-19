#!/usr/bin/env python3
"""Build high-quality WISE logo SVG matched to WISE_symbol.png."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_FULL = ROOT / "images" / "WISE_logo.svg"
OUT_SYMBOL = ROOT / "images" / "WISE_symbol.svg"

RED = "#9E2438"
PURPLE = "#311322"
GRAY = "#424E59"
BLUE = "#2C5162"

T = 13.0
R = 6.5

# Traced from WISE_symbol.png (100 × 100 viewBox)
PL = 4.0
RL = 17.0
RR = 70.0
GR = 83.0
BL = 31.0
BR = 50.0
ARM = 56.0

YT = 4.0
Y1 = 22.0
Y2 = 42.0
Y3 = 64.0
YB = 83.0


def _round(d: str) -> str:
    import re
    return re.sub(r"(\d+\.\d+)", lambda m: f"{float(m.group(1)):.2f}".rstrip("0").rstrip("."), d)


def hbar(x1: float, x2: float, y: float) -> str:
    w = x2 - x1
    if w <= 0:
        return ""
    if w < T:
        return _round(f"M {x1},{y} H {x2} V {y + T} H {x1} Z")
    r = min(R, T / 2, w / 2)
    return _round(
        f"M {x1 + r},{y} H {x2 - r}"
        f" C {x2 - r * 0.45},{y} {x2},{y + r * 0.45} {x2},{y + r}"
        f" V {y + T - r}"
        f" C {x2},{y + T - r * 0.45} {x2 - r * 0.45},{y + T} {x2 - r},{y + T}"
        f" H {x1 + r}"
        f" C {x1 + r * 0.45},{y + T} {x1},{y + T - r * 0.45} {x1},{y + T - r}"
        f" V {y + r}"
        f" C {x1},{y + r * 0.45} {x1 + r * 0.45},{y} {x1 + r},{y} Z"
    )


def vbar(x: float, y1: float, y2: float) -> str:
    h = y2 - y1
    if h <= 0:
        return ""
    if h < T:
        return _round(f"M {x},{y1} H {x + T} V {y2} H {x} Z")
    r = min(R, T / 2, h / 2)
    return _round(
        f"M {x},{y1 + r} V {y2 - r}"
        f" C {x},{y2 - r * 0.45} {x + r * 0.45},{y2} {x + r},{y2}"
        f" H {x + T - r}"
        f" C {x + T - r * 0.45},{y2} {x + T},{y2 - r * 0.45} {x + T},{y2 - r}"
        f" V {y1 + r}"
        f" C {x + T},{y1 + r * 0.45} {x + T - r * 0.45},{y1} {x + T - r},{y1}"
        f" H {x + r}"
        f" C {x + r * 0.45},{y1} {x},{y1 + r * 0.45} {x},{y1 + r} Z"
    )


def symbol_paths() -> list[tuple[str, str]]:
    """Basket weave: Purple>Red>Gray>Blue>Purple (clockwise)."""
    p: list[tuple[str, str]] = []

    def add(color: str, d: str) -> None:
        if d:
            p.append((color, d))

    # Back at crossings
    add(GRAY, hbar(ARM, GR + T, Y1))
    add(RED, vbar(RL, Y1, Y1 + T))       # red left at crossing band (TL, behind purple)
    add(PURPLE, hbar(PL, RL, Y3))
    add(BLUE, vbar(BR, Y2, Y3))

    # Mid layer
    add(PURPLE, vbar(PL, YT, YB))         # purple spine (full height)
    add(GRAY, vbar(GR, YT, YB))           # gray spine (full height)
    add(BLUE, hbar(BL, BR + T, YB))
    add(PURPLE, hbar(RL, ARM, Y3))
    add(GRAY, hbar(ARM, GR, Y3))

    # Front layer
    add(BLUE, vbar(BL, Y2, YB))
    add(BLUE, vbar(BR, Y3, YB))
    add(PURPLE, hbar(RL, ARM, Y1))
    add(RED, hbar(RL, RR + T, YT))
    add(RED, vbar(RL, Y1 + T, Y2))   # red left below purple arm (TL)
    add(RED, vbar(RR, Y1, Y2))       # red right over gray arm (TR)

    return p


def svg_wrap(paths: list[tuple[str, str]], view_box: str, title: str, title_id: str, extra: str = "") -> str:
    body = "\n    ".join(f'<path fill="{c}" d="{d}"/>' for c, d in paths)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}" role="img" aria-labelledby="{title_id}">
  <title id="{title_id}">{title}</title>
  <g id="wise-symbol">
    {body}
  </g>{extra}
</svg>
"""


def main() -> None:
    paths = symbol_paths()
    OUT_SYMBOL.write_text(
        svg_wrap(paths, "0 0 100 100", "WISE Symbol", "wise-symbol-title"),
        encoding="utf-8",
    )

    mark = "\n      ".join(f'<path fill="{c}" d="{d}"/>' for c, d in paths)
    OUT_FULL.write_text(
        svg_wrap(
            paths,
            "0 0 200 230",
            "WISE Logo",
            "wise-logo-title",
            extra=f"""
  <g transform="translate(100, 84) scale(1.5) translate(-50, -50)">
    <g id="wise-symbol-mark">
      {mark}
    </g>
  </g>
  <text
    x="100"
    y="198"
    text-anchor="middle"
    font-family="Arial, Helvetica, 'Segoe UI', sans-serif"
    font-size="52"
    font-weight="700"
    fill="#111111"
    letter-spacing="2"
  >WISE</text>""",
        ),
        encoding="utf-8",
    )
    print("Wrote", OUT_SYMBOL.name, "and", OUT_FULL.name)


if __name__ == "__main__":
    main()
