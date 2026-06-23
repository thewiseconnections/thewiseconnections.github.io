#!/usr/bin/env python3
"""
Validate website content and ensure Excel-derived CSVs are in sync.

Run locally or in CI:
  python3 scripts/validate-content.py
"""
from __future__ import annotations

import csv
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
SYNC_SCRIPT = ROOT / "scripts" / "sync-from-excel.py"

GENERATED_CSVS = (
    "chapters.csv",
    "past-advisory-board.csv",
    "conferences.csv",
)

CSV_SCHEMAS: dict[str, list[str]] = {
    "newsletters.csv": ["date", "title", "description", "link"],
    "advisory-board-current.csv": ["name", "title", "company", "bio"],
    "conference-gallery.csv": ["filename", "alt"],
    "chapters.csv": ["university"],
    "past-advisory-board.csv": ["year", "name", "photo"],
    "conferences.csv": [
        "year",
        "annual",
        "dates",
        "theme",
        "location",
        "universities",
        "program_pdf",
        "sponsors",
    ],
}


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)


def load_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def validate_json_files() -> bool:
    ok = True

    site_path = CONTENT / "site.json"
    try:
        site = json.loads(site_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"site.json is invalid: {exc}")
        return False

    required_site_keys = ("tagline", "hero", "whyGetInvolved", "mission", "values", "home")
    for key in required_site_keys:
        if key not in site:
            fail(f"site.json is missing required key: {key}")
            ok = False

    home = site.get("home", {})
    if not isinstance(home.get("offers"), list) or not home.get("offers"):
        fail("site.json home.offers must be a non-empty list")
        ok = False

    quiz_path = CONTENT / "career-quiz.json"
    try:
        quiz = json.loads(quiz_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"career-quiz.json is invalid: {exc}")
        ok = False
    else:
        career_ids = set(quiz.get("careers", {}))
        for question in quiz.get("questions", []):
            for answer in question.get("answers", []):
                for career_id in answer.get("scores", {}):
                    if career_id not in career_ids:
                        fail(
                            f"career-quiz.json references unknown career '{career_id}' "
                            f"in question: {question.get('text', '')[:60]}"
                        )
                        ok = False

    map_path = CONTENT / "advisory-map.json"
    if map_path.exists():
        try:
            json.loads(map_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            fail(f"advisory-map.json is invalid: {exc}")
            ok = False

    return ok


def validate_csv_files() -> bool:
    ok = True

    for filename, required_columns in CSV_SCHEMAS.items():
        path = CONTENT / filename
        if not path.exists():
            fail(f"Missing content file: {filename}")
            ok = False
            continue

        try:
            rows = load_csv(path)
        except csv.Error as exc:
            fail(f"{filename} could not be parsed: {exc}")
            ok = False
            continue

        if not rows:
            continue

        headers = {key.lower().strip() for key in rows[0]}
        for column in required_columns:
            if column not in headers:
                fail(f"{filename} is missing required column: {column}")
                ok = False

    return ok


def validate_asset_paths() -> bool:
    ok = True
    gallery_path = CONTENT / "conference-gallery.csv"
    if not gallery_path.exists():
        return ok

    for row in load_csv(gallery_path):
        filename = (row.get("filename") or "").strip()
        if not filename:
            continue
        if filename.startswith("http://") or filename.startswith("https://"):
            continue
        asset = ROOT / filename
        if not asset.exists():
            fail(f"conference-gallery.csv references missing file: {filename}")
            ok = False

    return ok


def validate_excel_sync() -> bool:
    before: dict[str, bytes | None] = {}
    for filename in GENERATED_CSVS:
        path = CONTENT / filename
        before[filename] = path.read_bytes() if path.exists() else None

    result = subprocess.run(
        [sys.executable, str(SYNC_SCRIPT)],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        fail("sync-from-excel.py failed")
        if result.stderr:
            print(result.stderr, file=sys.stderr)
        if result.stdout:
            print(result.stdout, file=sys.stderr)
        return False

    stale: list[str] = []
    for filename in GENERATED_CSVS:
        path = CONTENT / filename
        after = path.read_bytes() if path.exists() else None
        if after != before[filename]:
            stale.append(filename)

    if stale:
        fail(
            "Excel-derived CSV files are out of date. "
            "Run: python3 scripts/sync-from-excel.py"
        )
        for filename in stale:
            print(f"  - content/{filename}", file=sys.stderr)
        return False

    return True


def main() -> int:
    checks = [
        ("JSON files", validate_json_files),
        ("CSV files", validate_csv_files),
        ("Asset paths", validate_asset_paths),
        ("Excel sync", validate_excel_sync),
    ]

    all_ok = True
    for label, check in checks:
        if not check():
            all_ok = False
            print(f"Check failed: {label}", file=sys.stderr)

    if all_ok:
        print("All content checks passed.")
        return 0

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
