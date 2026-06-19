# WISE - Women Impacting Supply Chain Excellence Website

A modern, responsive website for the Women Impacting Supply Chain Excellence club organization. The site showcases club chapters, past conferences, and provides networking opportunities for women supply chain professionals.

## 📁 Project Structure

```
WISE Website/
├── content/             # Editable data (CSV + site.json) — see CONTENT-EDITING-GUIDE.md
├── index.html           # Home page
├── css/styles.css
├── js/
│   ├── script.js        # Navigation
│   ├── content.js       # Loads content/ into pages
│   └── contact.js
├── pages/
│   ├── about.html       # Our story, mission, values, founder quote
│   ├── chapters.html
│   ├── conferences.html
│   ├── advisory-board.html
│   ├── newsletters.html
│   └── contact.html
├── Resources/           # Excel masters, PDFs, photos
└── scripts/
    ├── sync-from-excel.py
    └── build-advisory-map.py
```

## 🎯 Features

### Pages
- **Home** - Why get involved, highlights, conference photos
- **About** - Our story, mission, values, founder message
- **Chapters** - Universities with WISE chapters
- **Conferences** - Symposium details and photo gallery
- **Advisory Board** - Current and past board members with interactive U.S. map
- **Newsletters** - WISE Connections archive
- **Career Explorer** - Interactive quiz for supply chain career paths
- **Contact** - Contact form and social links

### Editing content (for non-developers)
See **[CONTENT-EDITING-GUIDE.md](CONTENT-EDITING-GUIDE.md)**. Most lists come from CSV/Excel in `content/` and `Resources/` — no HTML editing required.

### Design Features
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern Styling** - Professional color scheme and clean typography
- 🧭 **Navigation** - Sticky header with mobile-friendly menu
- ♿ **Accessible** - Semantic HTML and accessible form elements

## 🎨 Color Scheme

- **Primary Color**: #8B3A62 (Purple/Burgundy) - Used for headings and primary elements
- **Secondary Color**: #2C3E50 (Dark Blue) - Used for footer and secondary sections
- **Accent Color**: #E74C3C (Red) - Used for CTAs and highlights
- **Light Background**: #F8F9FA (Light Gray) - Used for card backgrounds

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A text editor or IDE for modifications

### Running the Website

1. Open `index.html` in your web browser, or
2. Use a local development server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js with http-server
   npx http-server
   ```

3. Navigate to `http://localhost:8000` in your browser

## 📝 Content Sections

### Chapters
The website includes 6 regional chapters:
- Northeast Chapter (New York, NY)
- Midwest Chapter (Chicago, IL)
- Texas Chapter (Houston, TX)
- West Coast Chapter (Los Angeles, CA)
- Southeast Chapter (Atlanta, GA)
- Pacific Northwest Chapter (Seattle, WA)

### Conferences
- **Upcoming**: WISE Annual Summit 2025 (October 15-17, Denver, CO)
- **Past Events**: Archive from 2019-2024 with attendance numbers and highlights

## 🔧 Customization

### Adding a New Chapter
Edit `pages/chapters.html` and add a new chapter card:
```html
<div class="chapter-card">
    <h3>Your Chapter Name</h3>
    <p><strong>Location:</strong> City, State</p>
    <p><strong>Founded:</strong> Year</p>
    <p><strong>Members:</strong> Number+</p>
    <p>Description of chapter</p>
    <button class="btn btn-primary">Learn More</button>
</div>
```

### Changing Colors
Edit the CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #8B3A62;
    --secondary-color: #2C3E50;
    --accent-color: #E74C3C;
    --light-bg: #F8F9FA;
    --text-dark: #2C3E50;
    --text-light: #FFFFFF;
}
```

### Updating Contact Information
Edit `pages/contact.html` to update:
- Email addresses
- Phone numbers
- Mailing address
- Chapter director information in the table

## 📞 Contact

**General Inquiries**: info@wiseforums.org  
**Conference Information**: conferences@wiseforums.org  
**Chapter Inquiries**: chapters@wiseforums.org  
**Phone**: (555) 123-4567  
**Address**: 123 Business Park Avenue, New York, NY 10001

## 📄 License

© 2025 Women Impacting Supply Chain Excellence. All rights reserved.

## 🤝 Contributing

To contribute to the website:
1. Make your changes locally
2. Test across different browsers and devices
3. Submit updates through your organization's process

---

For more information about WISE, visit the website or contact the leadership team.
