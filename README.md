# Sweet Fern — Home Bakery Website

A hand-built, six-page static website for a home bakery on Canal Road, Surat.
No framework, no build step, no dependencies to install. Open `index.html` and it works.

---

## What is in here

```
sweet-fern/
├── index.html            Home
├── menu.html             Menu & prices
├── custom-cakes.html     Custom cake builder + enquiry
├── gallery.html          Photo gallery + lightbox
├── about.html            Story, process, FAQs
├── contact.html          Contact, hours, location, enquiry
│
├── css/
│   ├── tokens.css        Design tokens — colour, type, space, radius, shadow
│   ├── base.css          Reset, element defaults, typography, a11y primitives
│   ├── layout.css        Page shell — container, sections, grids, header, footer
│   ├── components.css    Buttons, cards, menu rows, forms, overlays, gallery
│   └── motion.css        Scroll-reveal + reduced-motion handling
│
├── js/
│   └── main.js           All behaviour (see below)
│
├── images/               Optimised WebP/PNG/JPG assets
├── robots.txt
└── sitemap.xml
```

**Load order matters.** Every page links the five stylesheets in the order above:
tokens → base → layout → components → motion. `tokens.css` must come first because
everything else consumes its custom properties.

---

## Design system

Everything visual is driven by `css/tokens.css`. Change a value there and it
propagates through the whole site — nothing is hard-coded in the page-level CSS.

| Token group | What it controls |
|---|---|
| `--forest`, `--cream`, `--cocoa`, `--gold`, `--ink` | The whole palette |
| `--font-display`, `--font-body` | Fraunces (headings) + Inter (body) |
| `--fs-*` | A fluid clamp-based type scale |
| `--s-1` … `--s-12` | An 8px-based spacing scale |
| `--r-xs` … `--r-pill` | One radius scale, no one-off values |
| `--shadow-sm` / `--shadow` / `--shadow-lg` | One warm shadow, three elevations |
| `--section-y`, `--gutter`, `--maxw` | Layout rhythm |

**Breakpoints:** 560px, 768px, 1024px, 1280px. The base styles are mobile-first;
everything rises from there.

**To change the brand colour**, edit `--forest` and `--gold` in `tokens.css`,
then re-generate `images/icon-*.png` and `images/og-image.jpg` to match.

---

## JavaScript

`js/main.js` is one IIFE with nine small initialisers, all progressive
enhancement — the site is fully readable and navigable with JS switched off.

| # | Module | What it does |
|---|---|---|
| 1 | `initHeader` | Adds `.is-stuck` to the header after 8px of scroll |
| 2 | `initDrawer` | Slide-in mobile nav — focus trap, scroll lock, Esc to close |
| 3 | `initPersonalise` | The optional name prompt (see below) |
| 4 | `initEnquiryForms` | Validates, then opens WhatsApp or email pre-filled |
| 5 | `initFaq` | Accordion on `about.html` |
| 6 | `initLightbox` | Gallery viewer — Esc to close, click-outside to close |
| 7 | `initHours` | Highlights today's row and shows an "Open now" badge |
| 8 | `initYear` | Fills any `[data-year]` with the current year |
| 9 | `initReveal` | IntersectionObserver scroll-reveal, disabled for reduced motion |

### Site configuration

All the values you are likely to change live in one object at the top of the file:

```js
var SITE = {
  whatsapp: '91XXXXXXXXXX',              // digits only, no + and no spaces
  email: 'hello@sweetfern.example',
  instagram: 'https://instagram.com/'
};
```

---

## What you must replace before publishing

Search the project for these and replace each one. Every occurrence is a
deliberate placeholder.

| Placeholder | Where | Notes |
|---|---|---|
| `91XXXXXXXXXX` | every page, `main.js` | WhatsApp number, digits only |
| `+91 XXXXX XXXXX` | every page | Displayed phone number |
| `hello@sweetfern.example` | every page, `main.js` | Contact email |
| `FSSAI Lic. No. XXXXXXXXXXXXXX` | footers, `contact.html` | Required for Indian food businesses |
| `<iframe>` map | `contact.html` | Google Maps embed |
| Instagram URL | `contact.html`, `main.js` | Your real profile |
| Testimonials | `index.html` | Three sample quotes — replace with real ones, with permission |
| `canonical` / `og:url` | every `<head>` | Replace with your own domain |

There are also HTML comments in the source pointing at the testimonials and the
map block, so you will find them if you search for `SAMPLE CONTENT` or `Map placeholder`.

---

## The entry-flow decision

The original site opened with a **blocking modal** that demanded first *and* last
name before any content was visible, and returned on every visit.

This build removes it entirely. In its place:

- The page renders immediately. There is no gate and no overlay on load.
- After the visitor scrolls a little (or 12 seconds pass), a small **dismissible
  card** slides up from the bottom offering a single optional field.
- There is a visible **"No thanks, don't ask again"** control.
- Choosing to skip is remembered, and the card never returns.
- The name is stored in `localStorage` under `dc.name` — on the visitor's device
  only. Nothing is transmitted anywhere, and no account exists.
- The name is used for one thing: a greeting in the hero, e.g.
  "Welcome back, Kashish."

To clear a stored name during testing, run this in the browser console:

```js
localStorage.removeItem('dc.name');
localStorage.removeItem('dc.promptSkipped');
```

---

## How forms work

There is **no backend**. Both enquiry forms (`custom-cakes.html`, `contact.html`)
validate in the browser, then compose a neatly formatted message and open either
WhatsApp (`wa.me/…?text=…`) or the visitor's mail client with it pre-filled. The
visitor reviews it and sends it themselves.

This was a deliberate choice: it needs no server, no database and no hosting
cost, and the visitor can see exactly what is being sent before it goes. If you
later want messages delivered to an inbox without the visitor pressing send,
that needs a real backend — at which point consider a small form endpoint
(a Netlify/Cloudflare Function or a Formspree account) and update
`initEnquiryForms` accordingly.

---

## Brand

The logo is a single fern frond in clean line art — warm cream and antique gold
on deep forest green — inside a rounded square. The same mark is used everywhere:
header, footer, and the favicon / app-icon set.

| File | Use |
|---|---|
| `images/icon-512.png` | App icon, structured-data `logo` |
| `images/icon-192.png` | Header + footer brand mark |
| `images/apple-touch-icon.png` | iOS home-screen icon (180px) |
| `images/favicon-32.png`, `favicon-64.png` | Browser tab |
| `images/og-image.jpg` | 1200×630 social share card |

The wordmark is set in Fraunces 600 with slightly tight tracking. The descriptor
line ("Home Bakery · Surat") is Inter, uppercase, tracked wide in `--gold`.
There is no script, handwritten or pink/watercolour styling anywhere in the brand.

---

## Images

Every image in `images/` is either a genuine photograph from the bakery's own
kitchen or an original image generated for this project. None are stock or
web-sourced.

Naming follows the content, not the source: `cheesecake-caramel.webp`,
`menu-brownies.webp`, `custom-cake.webp`, and so on.

All are WebP at quality 82 with sensible maximum widths, except the icons and
the Open Graph card. To regenerate an icon or `og-image.jpg` after a brand
change, you will need Pillow (`pip install pillow`).

---

## Deploying

The site is fully static, so any host works — Netlify, Cloudflare Pages, GitHub
Pages, or a plain Apache/Nginx directory.

1. Upload the whole `sweet-fern/` folder.
2. Point your domain at it.
3. Update the `canonical`, `og:url` and `sitemap.xml` URLs to that domain.
4. Update the `Sitemap:` line in `robots.txt`.
5. Submit `sitemap.xml` in Google Search Console.

No build step, no environment variables, nothing to compile.

---

## Accessibility notes

Targeting **WCAG 2.2 AA**.

- Semantic landmarks throughout: `header`, `nav`, `main`, `footer`, `aside`, `figure`/`figcaption`.
- A skip link on every page.
- The mobile drawer traps focus, locks scroll, closes on Esc, and returns focus to the toggle.
- The lightbox behaves the same way and restores focus on close.
- Every form field has a real `<label>`; errors are announced via `aria-live="polite"` and set `aria-invalid` on the offending input.
- Body text is `--ink` on `--cream`, which clears 4.5:1 comfortably. Accent text uses `--cocoa` rather than `--gold`, because gold at body size does not.
- Touch targets are at least 44×44px.
- `prefers-reduced-motion` is honoured: all transitions collapse and the scroll-reveal is disabled entirely.

---

## License

The site code is yours to modify and deploy. Photographs remain the property of
the bakery.
