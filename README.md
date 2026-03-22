# WISE - Women Impacting Supply Chain Excellence Website

A modern, responsive website for the Women Impacting Supply Chain Excellence club organization. The site showcases club chapters, past conferences, and provides networking opportunities for women supply chain professionals.

## 📁 Project Structure

```
WISE Website/
├── index.html           # Home page
├── css/
│   └── styles.css      # Main stylesheet with responsive design
├── js/
│   ├── script.js       # Main JavaScript for navigation and interactivity
│   └── contact.js      # Contact form handling
└── pages/
    ├── chapters.html   # Chapters directory page
    |__ What are WISE, WISE beyond and all called # WISE Beyond, WISE Foundation, can I get more details
    ├── conferences.html # Past conferences and upcoming events
    └── contact.html    # Contact form and chapter leadership directory, also social media handles
    |--- Advisory Board and Dr. T info # thinking of storing every years board
    |--- Newsletters # store all the edition of newsletter

```

## 🎯 Features

### Pages
- **Home** - Welcome page with organization overview and key highlights
- **Chapters** - Directory of all WISE chapters with details and membership information
- **Conferences** - Archive of past conferences and upcoming events
- **Contact** - Contact form and chapter leadership directory

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
