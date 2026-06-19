# WISE Website — Content Editing Guide

This guide is for team members who update the website **without editing HTML code**. Most updates are done in **Excel** or simple **spreadsheet files**.

## Before you start

1. Open the website folder: `WISE Website`
2. Start a local preview server (required for lists to load):
  ```bash
   cd "WISE Website"
   python3 -m http.server 8000
  ```
3. Open [http://localhost:8000](http://localhost:8000) in your browser and refresh after changes.

> **Tip:** Do not open `index.html` by double-clicking it. Lists and dynamic content need the local server above.

---

## What to edit for each page


| What you want to change                            | Where to edit                                              |
| -------------------------------------------------- | ---------------------------------------------------------- |
| Tagline, mission, our story, values, founder quote | `content/site.json`                                        |
| Newsletters list                                   | `content/newsletters.csv` (open in Excel)                  |
| Current advisory board members                     | `content/advisory-board-current.csv`                       |
| Past advisory board (by year)                      | `Resources/Advisory Board.xlsx` → run sync (below)         |
| University chapter list                            | `Resources/Chapters.xlsx` → run sync                       |
| Conference dates, theme, location                  | `Resources/Conferences.xlsx` → run sync                    |
| Conference photos on home & conferences page       | `content/conference-gallery.csv`                           |
| Program PDF links for conferences                  | `content/conferences.csv` column `program_pdf`             |
| Past board member photos                           | Not used on website (past members shown as name/university list) |
| Career Explorer quiz                               | `content/career-quiz.json`                                  |
| Advisory Board map markers + year filter           | `List of Advisory Board Members 2021-2026.xlsx` + map build script (shown on Advisory Board page) |


---

## Excel files you already have (`Resources/`)

### Advisory Board.xlsx

- One **sheet per year** (e.g. `2025`, `2024`, `2023`)
- Columns: **Name**, **University**, **Role**, **Sub-committee**
- Add a row for each past member
- Photo file name must match: `First Last.jpg` in folder `Resources/Photo keeping/AdvisoryBoard_2025/`

### Chapters.xlsx

- Add one university name per row under the **Chapter** column

### Conferences.xlsx

- One **sheet per year** (e.g. `2026`, `2025`)
- Rows: Dates, Theme, Annual, Location, Participating University

After editing these Excel files, run the sync script (see below).

---

## Newsletters (no Excel file yet — use CSV)

Open `content/newsletters.csv` in Excel.


| Column      | Example                                       |
| ----------- | --------------------------------------------- |
| date        | 03/15/2026                                    |
| title       | March 2026 WISE Connections Newsletter        |
| description | Short summary for the card                    |
| link        | [https://eepurl.com/](https://eepurl.com/)... |


- **Add a row** at the top for the newest issue.
- Save as **CSV (Comma delimited)** — keep the filename `newsletters.csv`.
- In Excel: File → Save As → CSV UTF-8 (Comma delimited) (*.csv)

---

## Current advisory board

Edit `content/advisory-board-current.csv`:


| name | title | company | bio |
| ---- | ----- | ------- | --- |


Save as CSV when done.

---

## Photos

### Conference gallery

Edit `content/conference-gallery.csv`:


| filename                                         | alt                   |
| ------------------------------------------------ | --------------------- |
| Resources/Photo keeping/Conferences/my-photo.jpg | Students at symposium |


Put new images in `Resources/Photo keeping/Conferences/` first, then reference that path.

### Past advisory board photos

1. Add `Person Name.jpg` to the correct year folder, e.g. `Resources/Photo keeping/AdvisoryBoard_2025/`
2. Add the name to `Advisory Board.xlsx` on that year’s sheet
3. Run sync script

---

## Sync Excel → website (past board, chapters, conferences)

After editing Excel in `Resources/`:

```bash
cd "WISE Website"
python3 scripts/sync-from-excel.py
```

Then refresh the browser.

First time only, install the helper:

```bash
pip install openpyxl
```

---

## Career Explorer quiz (`content/career-quiz.json`)

Students answer 6 questions and see a suggested supply chain career path.

- **questions** — Each question has `text` and `answers`. Each answer has `scores` pointing to career IDs (e.g. `"logistics": 3`).
- **careers** — Each career has `title`, `tagline`, `description`, `exampleRoles`, and `skills`.

To add a question, copy an existing question block and change the text and scores. Career IDs in `scores` must match keys under `careers`.

Preview at: http://localhost:8000/pages/career-explorer.html

---

## Advisory Board map automation

The website map on the Advisory Board page (`pages/advisory-board.html`) is generated from the workbook:

- `List of Advisory Board Members 2021-2026.xlsx` (source rows)
- `content/university-locations.csv` (cached geocoding lookup)
- `content/advisory-map.json` (final map data used by website)

After updating the workbook, run:

```bash
python3 scripts/build-advisory-map.py
```

Notes:
- First run is slower (geocodes universities).
- Future runs are faster because locations are cached in `content/university-locations.csv`.
- If a university geocode is wrong, edit `content/university-locations.csv` manually (lat/lon), then rerun the script.

---

## Editing mission, story, and values (`content/site.json`)

Ask a teammate comfortable with text files, or follow these rules:

- Only change text **inside the quotes**
- Do not delete commas `,` or curly braces `{` `}`
- Paragraph breaks in the founder quote: use `\n\n` between paragraphs inside the quote text

To switch taglines, change the `"tagline"` field. Options you provided are listed in that file’s comments or your org docs.

To use the **shorter founder quote**, replace the `founderQuote.text` block with the second Stephanie Thomas quote from your copy deck.

---

## Folder layout (simplified)

```
WISE Website/
├── content/              ← EDIT THESE (CSV + site.json)
│   ├── site.json
│   ├── newsletters.csv
│   ├── advisory-board-current.csv
│   ├── past-advisory-board.csv   (auto-generated from Excel)
│   ├── chapters.csv
│   ├── conferences.csv
│   └── conference-gallery.csv
├── Resources/            ← Excel masters + PDFs + photos
│   ├── Advisory Board.xlsx
│   ├── Chapters.xlsx
│   ├── Conferences.xlsx
│   └── Photo keeping/
├── pages/                ← Do not edit unless you know HTML
└── scripts/
    └── sync-from-excel.py
```

---

## When you need help

Contact whoever maintains the website repository. Common requests:

- New page section
- Design changes
- Connecting a contact form to email
- Publishing the site live (GitHub Pages, Netlify, etc.)

