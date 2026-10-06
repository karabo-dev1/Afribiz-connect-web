# Afribiz Connect · Universe

The glass and AI edition of the Afribiz Connect website: a single-page 3D journey through seven chambers.

## Files
- `index.html`: the page structure (intro, chambers, HUD, panel, chat)
- `assets/styles.css`: all styling (glass recipes, palette, typography, mobile layout)
- `assets/app.js`: the 3D scene, scroll journey, panels, AI assistant and voice
- `vendor/three.min.js`: Three.js r128, bundled so the site works without a CDN

## Run it locally
Opening `index.html` directly works, but a local server is closer to real hosting:

    cd afribiz-universe
    python3 -m http.server 8080

Then open http://localhost:8080

## Deploy
Upload the whole folder to any static host (Netlify, Vercel, cPanel, GitHub Pages, an S3 bucket). No build step is needed.

## Content to complete
All content lives in the data lists near the top of `assets/app.js`:
- `AWARDS`: only the three South African awards are named; the UK, Nigeria, Ghana and pan-African entries are placeholders.
- `NAMED_CLIENTS`: 8 client names are filled in; the other 123 stars show "Client 009" and so on.
- `CREW`: 4 people are named; 13 cards show a role only. Avatars use initials (no photos were supplied).

## AI assistant
Inside Claude the assistant answers live. On your own domain it answers from the built-in company facts (`localAnswer` and `FACTS` in `app.js`) until it is connected to an AI service through a small server, as noted in the spec's open items.

## Voice
Uses the Web Speech API (Chrome, Edge, Safari) in South African English. Microphone access needs HTTPS on a live domain.

## Enquiries
The enquiry form opens the visitor's email app addressed to info@afribizconnect.co.za. Swap in a form service if preferred.
