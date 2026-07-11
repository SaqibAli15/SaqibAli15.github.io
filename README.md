# Saqib Ali — Portfolio Website

A fast, fully responsive single-page portfolio for **Syed Muhammad Saqib Ali**, Senior Software Engineer & Development Team Lead. Built as a zero-build static site (HTML + CSS + vanilla JS) so it deploys anywhere with no toolchain.

## Highlights
- **Responsive** on mobile, tablet, and desktop (mobile menu, fluid type, adaptive grids).
- **Light & dark theme** with a toggle (remembers your choice; respects system preference).
- **Sections:** Hero + stats, About + quick facts, Journey timeline, Work (LegendEHR featured + 4 projects), Skills, Contact.
- **Working contact form** that emails you the visitor's name, email, subject, and message via [Web3Forms](https://web3forms.com) — no backend/server needed.
- Nice touches: scroll progress bar, scroll-reveal animations, scroll-spy nav, floating badges.

## Files
```
index.html      Page content & structure
styles.css      Design system, theming, responsive layout
script.js       Nav, theme, animations, contact-form logic
assets/8.png    Profile photo
```

---

## ⚙️ One-time setup: make the contact form email you

The form uses **Web3Forms** (free, no server). It's already wired up — you just need to drop in your access key.

1. Go to **https://web3forms.com**.
2. Enter **`syedmuhammadsaqibali@outlook.com`** (the address where you want to receive submissions) and click **Create Access Key**.
3. Check that inbox and copy the **access key** they send you (a UUID like `a1b2c3d4-...`).
4. Open **`index.html`**, find this line, and paste your key in place of the placeholder:
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
   ```
5. Save. Done — submissions now arrive in your inbox.

**How replies work:** each email arrives with the visitor's address set as *reply-to*, so hitting **Reply** in Outlook goes straight back to them. The email subject is `Portfolio inquiry: <their subject>`.

> Until a real key is set, the form validates input but shows a "not configured yet" message instead of sending. The free Web3Forms tier allows 250 submissions/month and includes spam filtering (a honeypot field is already included).

---

## ▶️ Preview locally

Just open `index.html` in a browser. Or serve it (recommended, so `fetch` to Web3Forms works cleanly):

```bash
# Python 3
python -m http.server 5173
# then visit http://localhost:5173
```

## 🚀 Deploy (pick one — all free)

- **Netlify / Vercel:** drag-and-drop the folder, or connect a repo. No build command; publish directory is the project root.
- **GitHub Pages:** push these files to a repo → Settings → Pages → deploy from the root of `main`.
- **Cloudflare Pages:** connect the repo, framework preset = *None*, build output = root.

No environment variables or server are required — the Web3Forms key lives safely in the client (it only permits sending to your registered address).

## Editing content
All copy lives in `index.html`. Update links in one place if they ever change:
- Email: `syedmuhammadsaqibali@outlook.com`
- LinkedIn: `https://www.linkedin.com/in/syedmuhammadsaqibali`
- GitHub: `https://github.com/SaqibAli15`
- Project links: legendehr.com · graphlogic.com · sheranwalagroup.pk
