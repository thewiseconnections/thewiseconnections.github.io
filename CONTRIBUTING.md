# Contributing to the WISE Website

Thank you for helping keep the WISE site accurate and up to date. This guide explains how to contribute safely so changes transfer cleanly between team members and leadership transitions.

## Before you start

1. Read [CONTENT-EDITING-GUIDE.md](CONTENT-EDITING-GUIDE.md) for where each type of content lives
2. Preview locally with `python3 -m http.server 8000` (see [README.md](README.md))
3. Run `python3 scripts/validate-content.py` before opening a pull request

## What you can edit

### Content contributors (no HTML experience needed)

| Change | Edit this | Notes |
|--------|-----------|-------|
| Tagline, mission, home page cards, founder quote | `content/site.json` | Change text inside quotes only |
| Newsletters | `content/newsletters.csv` | Save as CSV UTF-8 |
| Current advisory board | `content/advisory-board-current.csv` | |
| Conference photos | `content/conference-gallery.csv` + image files | |
| Chapters, past board, conferences | `Resources/*.xlsx` | Then run sync script |

### Web maintainers only

- `pages/`, `css/`, `js/` — layout, design, new features
- `scripts/` — build and validation tools

If you are unsure which lane you are in, ask the web maintainer before editing HTML.

## Source-of-truth rules

Follow these to avoid overwriting someone else's work:

1. **Excel is the master** for chapters, past advisory board, and conferences (`Resources/Chapters.xlsx`, `Advisory Board.xlsx`, `Conferences.xlsx`)
2. **CSV is the master** for newsletters, current board, gallery, and site copy
3. **Do not hand-edit** `content/past-advisory-board.csv`, `content/chapters.csv`, or `content/conferences.csv` — they are generated from Excel
4. After changing Excel, always run:
   ```bash
   python3 scripts/sync-from-excel.py
   ```

## Pull request workflow

```text
Edit content → Preview locally → Validate → Open PR → Review → Merge
```

1. **Branch** — Create a branch from `main` (e.g. `update-newsletters-march-2026`)
2. **Edit** — Make your content changes only in the allowed files
3. **Sync** — If you changed Excel, run the sync script and commit the updated CSVs too
4. **Validate** — Run `python3 scripts/validate-content.py`
5. **Pull request** — Open a PR with a short description of what you changed
6. **Review** — Wait for a maintainer to approve; CI must pass
7. **Merge** — Maintainer merges to `main`; the live site updates from there

### If GitHub feels intimidating

Send your updated CSV, Excel file, or photos to the web maintainer. They can open the pull request for you. The important part is using the right files and naming — not knowing Git inside out.

## Checklist before submitting

- [ ] Files saved with correct names (e.g. `newsletters.csv`, not `newsletters.xlsx`)
- [ ] Excel changes synced with `python3 scripts/sync-from-excel.py`
- [ ] Previewed at `http://localhost:8000`
- [ ] `python3 scripts/validate-content.py` passes
- [ ] No edits to `pages/`, `css/`, or `js/` unless you are a maintainer

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Edited old duplicate HTML at repo root | Only edit files in `pages/` (root duplicates were removed) |
| Edited generated CSV directly | Edit Excel, run sync script |
| Broke `site.json` | Only change text inside quotes; keep commas and braces |
| Images not showing | Check path in CSV matches actual file location |
| Lists empty in browser | Use local server, not double-clicking `index.html` |

## Advisory board map

If you update `List of Advisory Board Members 2021-2026.xlsx`, also run:

```bash
python3 scripts/build-advisory-map.py
```

Commit the updated `content/advisory-map.json`.

## Questions

Contact the current web maintainer for:

- New page sections or design changes
- Contact form setup
- Hosting and domain access
- Handoff when leadership changes
