# Albedo Solar — Futuristic Remake

A full, modern/futuristic redesign of [albedo-solar.com](https://albedo-solar.com/) that keeps
the original essence (clean solar energy, Guatemala, the teal→green brand, Spanish copy, the
90%-savings financing story) while pushing the visual language forward: dark glassmorphic UI,
animated solar-gradient accents, glowing depth, bento layouts, scroll reveals and animated stats.

## Pages
| File | Original page |
|------|---------------|
| `index.html` | Inicio |
| `beneficios.html` | Beneficios de la energía solar |
| `como-trabajamos.html` | Cómo trabajamos |
| `clientes.html` | Nuestros clientes |
| `contacto.html` | Contáctanos |

## Stack
Plain, dependency-free **HTML + CSS + JS** (no build step). Fonts via Google Fonts
(Space Grotesk + Inter). All imagery is the real Albedo photography, downloaded into
`assets/images/`.

## Structure
```
albedo/
├── index.html  beneficios.html  como-trabajamos.html  clientes.html  contacto.html
├── assets/
│   ├── css/styles.css      # design system + all components
│   ├── js/main.js          # nav, reveals, counters, before/after slider, video, form
│   └── images/             # all original site images (logo, hero, clients, etc.)
└── README.md
```

## Design language
- **Brand gradient** teal `#2dd4bf` → green `#4ade80` (from the original sun-leaf logo)
- **Solar accent** `#facc15` (from the original "¡90% de ahorros!" chart)
- Dark base, glass surfaces, ambient aurora glows, faint grid + the original topographic texture
- Components: glowing pill buttons, glass cards, bento grid, stat counters, 5-step timeline,
  interactive before/after bill slider, lazy YouTube embeds, glass contact form.

## Run locally
```bash
cd albedo
python3 -m http.server 8000
# open http://localhost:8000
```

## Notes
- The contact form is front-end only (shows a success message); wire it to a backend/Formspree to send real mail.
- The language toggle (ES/EN) is visual — the site is authored in Spanish like the original.
- Video sections embed the original YouTube clip (`UJ7gDQhjEqg`) on click.
