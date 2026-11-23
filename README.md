# Priyanka & Sakti – Wedding Invitation

Plain HTML + CSS + vanilla JavaScript. No build step.

Website Link: https://raj333sh.github.io/sakti-priyanka-wedding/

## Photographs (`assets/images/`)
- `couple-portrait-night.jpg` – hero
- `bride-priyanka-portrait.jpg`, `groom-sakti-portrait.jpg` – couple section
- `couple-bouquet-moment.jpg` – closing section
- All four appear in the gallery.

**Replace:** overwrite a file with the same name (JPG, ~1600px long edge, under 400 KB).
**Add:** copy the image into `assets/images/`, then copy any `<button class="g">…</button>` block inside `#gal` in `index.html` and change the `src`, `alt`, `width` and `height`. The gallery is a masonry layout: it arranges photos of any shape automatically, with no gaps and no other changes needed.

## Music
Put an instrumental file at `assets/music/invitation.mp3`. Without it, a soft generated tone plays instead. Music starts only after "OPEN INVITATION" and can be toggled with the ♪ button.

## Google Maps
In `index.html`, section `#venue`, replace the text after `q=` / `destination=` / `query=` in the iframe and both button links with your venue's name and address (spaces as `+`). For an exact pin, open the place in Google Maps → Share → Embed a map, and paste the `src` into the iframe.

## Calendar
Events are all-day entries (no start times were supplied). Edit the `EVENTS` object at the top of `js/script.js`.

## Deploy
**GitHub Pages:** push the folder to a repo → Settings → Pages → deploy from `main` / root. Share the resulting URL.
**Netlify:** drag the `wedding-invitation` folder onto app.netlify.com/drop.
**Vercel:** `npm i -g vercel`, then run `vercel` inside the folder (framework: Other, no build command).
