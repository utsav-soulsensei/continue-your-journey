# SoulSensei — Free Workshops Funnel

A 3-screen flow that matches the SoulSensei theme:

1. **`index.html`** — landing with the *"5 Complimentary LIVE Workshops"* CTA.
2. **`form.html`** — collects **Name, Email, Phone** and writes them to a Google Sheet.
3. **`thankyou.html`** — confirmation screen that auto-redirects to `https://soulsensei.in` after **15 seconds**.

```
index.html  ──CTA──▶  form.html  ──submit──▶  Google Sheet
                                   │
                                   └──▶  thankyou.html  ──15s──▶  soulsensei.in
```

## Connect the Google Sheet (one-time)

The form saves to this sheet:
`https://docs.google.com/spreadsheets/d/1V5go6_MFTroKkQkIo0BVeBwhNCeuw0hb0l90Pp2FXEs/edit`

1. Open the sheet → **Extensions → Apps Script**.
2. Delete any boilerplate, paste all of **`google-apps-script.gs`**, and save.
3. Select the **`setup`** function in the toolbar and click **Run**. Authorize when prompted
   (this creates a `Leads` tab with a header row).
4. **Deploy → New deployment → Web app**
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
5. Copy the **Web app URL** (ends in `/exec`).
6. Open **`app.js`** and replace `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL.

> After any change to the Apps Script code, redeploy a **new version**
> (Deploy → Manage deployments → ✏️ Edit → Version: New version).

Until the URL is set, the form still works end-to-end (it just skips saving and
logs a warning to the console) so you can preview the flow.

## Run locally

Open from a local server so the relative paths and `fetch` behave like production:

```bash
cd "Kavyal Form"
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

These are static files — host the folder on any static host (Netlify, Vercel,
GitHub Pages, Firebase Hosting, or under `soulsensei.in/...`). Make sure
`index.html`, `form.html`, `thankyou.html`, `styles.css`, and `app.js` stay in
the same directory.

## Notes

- The "guides" photo strip on the landing page uses styled placeholders. Drop in
  real images by adding `<img src="...">` inside each `.face` div in `index.html`.
- Phone/email are validated client-side before submit.
- The redirect destination and countdown are set at the top of the script block
  in `thankyou.html`.
