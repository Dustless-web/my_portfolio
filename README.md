# AVINASH SANGISETTI — Portfolio

> Personal portfolio website for **Avinash Sangisetti**, AI Engineer & Full Stack Developer based in Bengaluru, India.

**Live →** `https://avinashs.vercel.app`

---

## ✦ Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (semantic) |
| Styling | Vanilla CSS — custom design system |
| Animations | [Anime.js v4](https://animejs.com) (ESM, vendored) |
| 3D / Particles | [Three.js r128](https://threejs.org) |
| Smooth Scroll | [Lenis](https://github.com/studio-freight/lenis) |
| Typography | Syncopate · Manrope · JetBrains Mono (Google Fonts) |

---

## ✦ Features

- **Preloader** with animated progress bar that transitions into the hero entrance
- **Text scramble** effect on the hero heading
- **Staggered hero entrance** — nav, meta tags, paragraph, CTA, and profile image all animate in sequence using Anime.js v4
- **Scroll-triggered animations** — section headers, timeline rows, project cards, and footer all animate in via `IntersectionObserver`
- **Custom cursor** — dot + lagging ring with hover expand effect
- **Interactive 3D particle field** (Three.js) responding to mouse movement
- **Fullscreen menu** with animated TorusKnot and staggered link entrance/exit
- **Project case study overlay** — slides up with content stagger
- **Contact modal** — email, phone, Instagram
- **Spotlight hover effect** on cards (CSS radial gradient following cursor)
- **Scroll progress bar** at the top of the page
- **Logo → smooth scroll to top** via Lenis

---

## ✦ Project Structure

```
my_portfolio/
├── index.html          # Main page structure
├── style.css           # Full design system + component styles
├── script.js           # All JS — animations, interactions, Three.js
├── lib/
│   └── anime.esm.min.js  # Vendored Anime.js v4 ESM bundle
├── pfp.png             # Profile photo (glitch card)
├── resume.pdf          # Downloadable resume
└── .gitignore
```

---

## ✦ Running Locally

Because `script.js` uses ES modules, the site **must be served over HTTP** (not opened as a `file://`).

```bash
# Option 1 — npx serve (no install required)
npx serve . -l 3000

# Option 2 — Python
python -m http.server 3000

# Then open
http://localhost:3000
```

---

## ✦ Sections

| # | Section | Description |
|---|---|---|
| 01 | Hero | Scramble heading, profile glitch card, CTA |
| 02 | Journey | Timeline — education & freelance experience |
| 03 | Work | 4 project cards with case study overlay |
| — | Marquee | Scrolling tech stack ticker |
| — | Footer | CTA + social links + contact |

---

## ✦ Design Tokens

```css
--bg:          #050505
--text:        #f0f0f0
--text-muted:  #888888
--border:      rgba(255, 255, 255, 0.15)

--font-display: 'Syncopate'
--font-main:    'Manrope'
--font-mono:    'JetBrains Mono'
```

---

## ✦ Contact

| | |
|---|---|
| Email | avinashsangisetti@gmail.com |
| Phone | +91 7795150609 |
| GitHub | [github.com/Dustless-web](https://github.com/Dustless-web) |

---

<p align="center">© 2025 Avinash Sangisetti</p>
