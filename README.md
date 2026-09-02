# Portfolio Website (Dynamic JSON-Driven)

A modern, responsive portfolio website built with **Next.js**, **Tailwind CSS**, and **TypeScript**, styled after the minimalist aesthetic of [https://guntas-13.github.io/](https://guntas-13.github.io/).

Everything on the website is controlled by a single JSON configuration file located at `data/portfolio.json`.

---

## 🚀 Getting Started

### 1. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

### 2. Build for Production
```bash
npm run build
```

---

## ⚙️ How to Update Your Details

To update the content of your portfolio, edit **[`data/portfolio.json`](./data/portfolio.json)**. Any change you save will automatically reflect on the website!

### Configuration Structure in `data/portfolio.json`:

| Section | Description |
| :--- | :--- |
| **`meta`** | Browser tab title, SEO description, and favicon path |
| **`personal`** | Your name, logo text, headline role, university/affiliation, profile picture, and resume link |
| **`navLinks`** | Navbar items (supports internal `#section` links and external URLs like Blogs/Docs) |
| **`socials`** | Links to your LinkedIn, GitHub, etc. |
| **`about`** | Subtitle, title, portrait photo, caption, experience cards, education cards, and narrative paragraphs |
| **`projects`** | Array of project cards with title, description, screenshot image, and action buttons |
| **`posters`** | Research posters or publication cards with images and links |
| **`pors`** | Positions of Responsibility and leadership roles with checkmarks |
| **`contact`** | Contact subtitle, email address, and LinkedIn profile link |
| **`footer`** | Copyright notice |

---

## 🖼️ Adding Your Own Images & Files

Put your custom profile pictures, project screenshots, and PDF resume inside the `public/assets/` directory.

Then, reference them in `data/portfolio.json` starting with `/assets/`:
- Profile image: `"/assets/my-photo.jpg"`
- Resume: `"/assets/my-resume.pdf"`
- Project screenshot: `"/assets/project-1.png"`

---

## 📦 Deployment

This project can be deployed anywhere:
- **Vercel**: Simply push to GitHub and import the repository into [Vercel](https://vercel.com).
- **GitHub Pages**: Run `npm run build` with `output: 'export'` in `next.config.mjs` to export a static build to GitHub Pages.
- **Netlify / Cloudflare Pages**: Zero-configuration static hosting.
