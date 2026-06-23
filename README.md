# WISE — Women Impacting Supply Chain Excellence Website

A static website for the WISE club. Page layout lives in HTML/CSS/JS; most text and lists live in `content/` so non-developers can update the site without touching code.

## Project structure

```
WISE Website/
├── content/              # Editable data (CSV + JSON)
├── index.html            # Home page
├── pages/                # All other pages (edit only if you know HTML)
├── css/styles.css
├── js/
│   ├── script.js         # Navigation
│   ├── content.js        # Loads content/ into pages
│   ├── contact.js
│   ├── career-quiz.js
│   └── advisory-map.js
├── Resources/            # Excel masters, PDFs, photos
├── images/
└── scripts/
    ├── sync-from-excel.py
    ├── build-advisory-map.py
    └── validate-content.py
```

## Pages

- **Home** — Highlights, conference photos, links to key sections
- **About** — Story, mission, values, founder message
- **Chapters** — Universities with WISE chapters
- **Conferences** — Symposium details and photo gallery
- **Advisory Board** — Current and past members with interactive map
- **Newsletters** — WISE Connections archive
- **Career Explorer** — Supply chain career quiz
- **Contact** — Contact form and social links

## Editing content

**Start here:** [CONTENT-EDITING-GUIDE.md](CONTENT-EDITING-GUIDE.md)

**Contributing workflow:** [CONTRIBUTING.md](CONTRIBUTING.md)

Most updates go in `content/` (CSV/JSON) or `Resources/` (Excel, photos). Do not edit HTML unless you are maintaining the site design.

### Two lanes

| Lane | Who | What to edit |
|------|-----|--------------|
| **Content** | Board members, newsletter editors, chapter leads | `content/`, `Resources/` |
| **Code/design** | Web maintainers (1–2 people) | `pages/`, `css/`, `js/`, `scripts/` |

## Local preview

Lists and dynamic content require a local server. Do not open `index.html` by double-clicking.

```bash
cd "WISE Website"
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) and refresh after changes.

### After editing Excel in `Resources/`

```bash
python3 scripts/sync-from-excel.py
```

Install the helper once:

```bash
pip install -r scripts/requirements.txt
```

### Validate before opening a pull request

```bash
python3 scripts/validate-content.py
```

This checks JSON/CSV files, image paths, and whether Excel-derived CSVs are in sync.

## GitHub workflow

1. Create a branch for your changes
2. Open a pull request (do not push directly to `main`)
3. CI runs `validate-content.py` automatically
4. A site maintainer reviews and merges

Enable branch protection on `main` in GitHub repo settings so all changes go through pull requests.

## Deployment

The site is static HTML. Common hosting options:

- **GitHub Pages** — Deploy from the `main` branch
- **Netlify / Vercel** — Connect the repo for preview deploys on each PR

## License

© Women Impacting Supply Chain Excellence. All rights reserved.
