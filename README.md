# Albedo Solar — Website

Bilingual (ES/EN) marketing + financing site for Albedo Solar, a Central America solar
financing company (founded in Guatemala; serving Guatemala, Honduras and El Salvador).
Built to the founder's June 2026 feedback spec: three audiences (clients, installer
partners, investors), full bilingual copy, Central America repositioning, working contact
form, savings estimator, video case studies, and live-ready trackers.

## Pages
| File | ES | EN |
|------|----|----|
| `index.html` | Inicio | Home |
| `beneficios.html` | Beneficios (+ savings estimator, trust block) | Benefits |
| `como-trabajamos.html` | Cómo trabajamos | How we work |
| `clientes.html` | Casos de éxito (video gallery + bill slider) | Case studies |
| `socios.html` | Socios (installer partners) | Partners |
| `inversionistas.html` | Inversionistas | Investors |
| `contacto.html` | Contáctanos (working form) | Contact |
| `faq.html` | Preguntas frecuentes | FAQ |
| `privacidad.html` / `terminos.html` | Legal (drafts) | Legal (drafts) |

## Stack
Dependency-free **HTML + CSS + JS**, no build step (GitHub Pages friendly).
Fonts: Space Grotesk + Inter. All imagery is real Albedo photography in `assets/images/`.

## Bilingual model (important)
Spanish is the **rendered default** in the HTML. English lives in attributes:
- `data-en` — swaps element content (uses `innerHTML`, so inline `<strong>`/gradient
  `<span>` work; escape them as `&lt;span&gt;` inside the attribute).
- `data-en-ph` / `data-en-alt` / `data-en-aria` — swap placeholder / alt / aria-label.
- `<title data-en>` and `<meta name="description" data-en>` are swapped too.

The `ES/EN` toggle (`assets/js/main.js`) persists the choice in `localStorage`,
respects `?lang=en`, and updates `<html lang>`. No page duplication, no broken no-JS state.

## ⚠️ Before launch — must configure
1. **Contact form endpoint.** In `assets/js/main.js`, replace `FORM_ENDPOINT`
   (`https://formspree.io/f/REPLACE_WITH_FORM_ID`) with the real Formspree/Netlify form id.
   Until then the form shows an error and points users to WhatsApp. Leads route by the
   "Soy" field (Empresa / Hogar / Instalador / Inversionista / Otro).
2. **Case-study video IDs.** YouTube was unreachable from the build environment, so the
   case cards on `clientes.html` and the "in action" embeds link to the channel and carry
   `[CONFIRM video ID]` comments mapping each card to the founder's Section 9 video.
   Swap each placeholder for the real 11-char ID (turn a card into a `data-video="ID"`
   lazy embed like the homepage one).
3. **Brand pack.** Apply the official logo files and Marca Albedo colours/type from Drive
   (current build reuses the existing brand palette and real photos).
4. **Domain + HTTPS, analytics, hreflang** per the spec's technical section.

## Items awaiting Alex (left tagged in copy as `[Por confirmar]` / `[To be confirmed]`)
- Financing term (year count), interest rate, credit requirements.
- Warranty ranges (panels 25–30 yrs, inverters 5–12 yrs).
- Corrected, sourced CO2 equivalencies on `beneficios.html` (current figures kept as floor;
  the inconsistent "vehicles" equivalencies were removed).
- Savings-estimator assumptions (currently 90% savings rate, 25-yr horizon, in `main.js`).
- Live data feeds for the trackers (counters animate from `data-count`; swap values or wire
  to the feed — `280+`, `0.9%`, `135,000+`, `$72M+`, etc.).

## Resolved per spec
Payback = 3–4 years (no financing). Electricity ~3× the US average (was 2×).
Carbon reduction "hasta 90%" (was 95%). "280+ proyectos" replaces "miles de clientes".
Repositioned Guatemala → Central America throughout. Floating WhatsApp on every page.

## Run locally
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
