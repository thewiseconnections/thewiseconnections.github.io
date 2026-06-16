/**
 * Loads editable content from the /content folder (CSV + JSON).
 * Editors update spreadsheets there; pages render automatically.
 */
(function () {
    function contentBase() {
        return window.location.pathname.includes('/pages/') ? '../content/' : 'content/';
    }

    function assetPath(relativePath) {
        if (!relativePath) return '';
        if (relativePath.startsWith('http') || relativePath.startsWith('/')) {
            return relativePath;
        }
        const base = window.location.pathname.includes('/pages/') ? '../' : '';
        return base + relativePath;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text == null ? '' : String(text);
        return div.innerHTML;
    }

    function parseCSV(text) {
        const rows = [];
        let row = [];
        let cell = '';
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            const next = text[i + 1];

            if (ch === '"') {
                if (inQuotes && next === '"') {
                    cell += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (ch === ',' && !inQuotes) {
                row.push(cell.trim());
                cell = '';
            } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
                if (ch === '\r' && next === '\n') i++;
                row.push(cell.trim());
                if (row.some((c) => c !== '')) rows.push(row);
                row = [];
                cell = '';
            } else {
                cell += ch;
            }
        }

        if (cell.length || row.length) {
            row.push(cell.trim());
            if (row.some((c) => c !== '')) rows.push(row);
        }

        if (!rows.length) return [];
        const headers = rows[0].map((h) => h.toLowerCase().trim());
        return rows.slice(1).map((values) => {
            const obj = {};
            headers.forEach((h, idx) => {
                obj[h] = values[idx] || '';
            });
            return obj;
        });
    }

    async function loadJSON(file) {
        const res = await fetch(contentBase() + file);
        if (!res.ok) throw new Error('Could not load ' + file);
        return res.json();
    }

    async function loadCSV(file) {
        const res = await fetch(contentBase() + file);
        if (!res.ok) throw new Error('Could not load ' + file);
        return parseCSV(await res.text());
    }

    async function applySiteCopy() {
        const site = await loadJSON('site.json');

        document.querySelectorAll('[data-site="tagline"]').forEach((el) => {
            el.textContent = site.tagline;
        });
        document.querySelectorAll('[data-site="hero-headline"]').forEach((el) => {
            el.textContent = site.hero.headline;
        });
        document.querySelectorAll('[data-site="hero-subheadline"]').forEach((el) => {
            el.textContent = site.hero.subheadline;
        });
        document.querySelectorAll('[data-site="why-get-involved"]').forEach((el) => {
            el.textContent = site.whyGetInvolved;
        });
        document.querySelectorAll('[data-site="mission"]').forEach((el) => {
            el.textContent = site.mission;
        });

        const storyEl = document.getElementById('our-story');
        if (storyEl && site.ourStory) {
            storyEl.innerHTML = site.ourStory.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
        }

        const valuesEl = document.getElementById('values-grid');
        if (valuesEl && site.values) {
            valuesEl.innerHTML = site.values
                .map(
                    (v) => `
                <div class="value-card">
                    <h3>${escapeHtml(v.title)}</h3>
                    <p>${escapeHtml(v.description)}</p>
                </div>`
                )
                .join('');
        }

        const quoteEl = document.getElementById('founder-quote');
        if (quoteEl && site.founderQuote) {
            const paragraphs = site.founderQuote.text.split('\n\n').map((p) => `<p>${escapeHtml(p)}</p>`).join('');
            quoteEl.innerHTML = `
                <blockquote class="founder-quote">
                    ${paragraphs}
                    <footer>— ${escapeHtml(site.founderQuote.author)}</footer>
                </blockquote>`;
        }

        document.querySelectorAll('[data-site="subscribe-url"]').forEach((el) => {
            el.href = site.newsletterSubscribeUrl;
        });
        document.querySelectorAll('[data-site="archive-url"]').forEach((el) => {
            el.href = site.newsletterArchiveUrl;
        });
    }

    async function renderNewsletters() {
        const grid = document.getElementById('newsletter-grid');
        if (!grid) return;

        const items = await loadCSV('newsletters.csv');
        grid.innerHTML = items
            .map(
                (n) => `
            <div class="newsletter-card">
                <div class="newsletter-date">${escapeHtml(n.date)}</div>
                <h3>${escapeHtml(n.title)}</h3>
                <p>${escapeHtml(n.description)}</p>
                <a href="${escapeHtml(n.link)}" class="btn btn-secondary" target="_blank" rel="noopener">Read Newsletter</a>
            </div>`
            )
            .join('');
    }

    async function renderAdvisoryBoard() {
        const currentGrid = document.getElementById('board-grid');
        if (currentGrid) {
            const members = await loadCSV('advisory-board-current.csv');
            currentGrid.innerHTML = members
                .map(
                    (m) => `
                <div class="board-member">
                    <div class="member-info">
                        <h3>${escapeHtml(m.name)}</h3>
                        <p class="title">${escapeHtml(m.title)}</p>
                        <p class="company">${escapeHtml(m.company)}</p>
                        <p class="bio">${escapeHtml(m.bio)}</p>
                    </div>
                </div>`
                )
                .join('');
        }

        const pastContainer = document.getElementById('past-board-container');
        if (!pastContainer) return;

        const past = await loadCSV('past-advisory-board.csv');
        const byYear = {};
        past.forEach((row) => {
            if (!row.year || !row.name) return;
            if (!byYear[row.year]) byYear[row.year] = [];
            byYear[row.year].push(row);
        });

        const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));
        pastContainer.innerHTML = years
            .map((year) => {
                const cards = byYear[year]
                    .map(
                        (m) => `
                    <div class="board-photo-card">
                        <img src="${assetPath(m.photo)}" alt="${escapeHtml(m.name)}" class="board-photo" loading="lazy">
                        <p class="photo-name">${escapeHtml(m.name)}</p>
                    </div>`
                    )
                    .join('');
                return `
                <div class="past-board-period" data-year="${escapeHtml(year)}">
                    <h3>${escapeHtml(year)}</h3>
                    <div class="photo-gallery">${cards}</div>
                </div>`;
            })
            .join('');
    }

    async function renderChapters() {
        const grid = document.getElementById('university-grid');
        if (!grid) return;

        const chapters = await loadCSV('chapters.csv');
        grid.innerHTML = chapters
            .map((c) => `<div class="university-tile">${escapeHtml(c.university)}</div>`)
            .join('');
    }

    async function renderConferences() {
        const timeline = document.getElementById('conference-timeline');
        if (timeline) {
            const conferences = await loadCSV('conferences.csv');
            timeline.innerHTML = conferences
                .map((c) => {
                    const programLink = c.program_pdf
                        ? `<p><strong>More Info:</strong> <a href="${assetPath(encodeURI(c.program_pdf))}" target="_blank" rel="noopener">View Program PDF</a></p>`
                        : '';
                    const sponsors = c.sponsors
                        ? `<p><strong>Sponsors:</strong> ${escapeHtml(c.sponsors)}</p>`
                        : '';
                    const universities = c.universities
                        ? `<p><strong>Participating Universities:</strong> ${escapeHtml(c.universities)}</p>`
                        : '';
                    return `
                <div class="conference-item">
                    <div class="year">${escapeHtml(c.year)}</div>
                    <div class="conference-details">
                        <h3>${escapeHtml(c.annual)} Annual WISE Conference</h3>
                        <p><strong>Dates:</strong> ${escapeHtml(c.dates)}</p>
                        <p><strong>Theme:</strong> ${escapeHtml(c.theme)}</p>
                        <p><strong>Location:</strong> ${escapeHtml(c.location)}</p>
                        ${universities}
                        ${sponsors}
                        ${programLink}
                    </div>
                </div>`;
                })
                .join('');
        }

        const gallery = document.getElementById('conference-gallery');
        if (gallery) {
            const photos = await loadCSV('conference-gallery.csv');
            gallery.innerHTML = photos
                .map(
                    (p) =>
                        `<img src="${assetPath(p.filename)}" alt="${escapeHtml(p.alt)}" class="gallery-photo" loading="lazy">`
                )
                .join('');
        }

        const homeGallery = document.getElementById('home-conference-gallery');
        if (homeGallery) {
            const photos = await loadCSV('conference-gallery.csv');
            homeGallery.innerHTML = photos
                .map(
                    (p) =>
                        `<img src="${assetPath(p.filename)}" alt="${escapeHtml(p.alt)}" class="conf-photo" loading="lazy">`
                )
                .join('');
        }
    }

    async function init() {
        const page = document.body.dataset.page;
        try {
            if (document.querySelector('[data-site]') || page === 'about' || page === 'home') {
                await applySiteCopy();
            }
            if (page === 'newsletters') await renderNewsletters();
            if (page === 'advisory-board') await renderAdvisoryBoard();
            if (page === 'chapters') await renderChapters();
            if (page === 'conferences' || page === 'home') await renderConferences();
        } catch (err) {
            console.error('Content loading failed. Use a local server (see README).', err);
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
