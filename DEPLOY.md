# Deploying to services.biopc.org

The site is a **static export** — `npm run build` writes plain HTML, CSS, JS and
assets to `out/`. There is no Node server to run, so it drops onto Hostinger (or
any static host) as a folder of files.

## 1. Configure the quotation endpoint

Create `.env.local` (not committed):

```
NEXT_PUBLIC_QUOTE_ENDPOINT=https://script.google.com/macros/s/XXXXXXXX/exec
```

Without it the form falls back to a pre-filled `mailto:` — usable, but you lose
file attachments and the submission log.

### Apps Script receiver

In a new Google Sheet: **Extensions → Apps Script**, paste the following, then
**Deploy → New deployment → Web app**, execute as *Me*, access *Anyone*.

```javascript
const FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID'; // where uploaded structures land
const NOTIFY = 'biopc.research@gmail.com';

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  const links = (d.files || []).map(f => {
    const b64 = String(f.content).split(',')[1];
    const blob = Utilities.newBlob(Utilities.base64Decode(b64), f.type, f.name);
    return DriveApp.getFolderById(FOLDER_ID).createFile(blob).getUrl();
  });

  sheet.appendRow([
    new Date(), d.name, d.institution, d.email, d.whatsapp, d.pdb,
    d.length, (d.analysis || []).join('; '), d.deadline, d.notes,
    links.join('\n'),
  ]);

  MailApp.sendEmail({
    to: NOTIFY,
    subject: 'MD quotation request — ' + d.name,
    body: [
      'Name: ' + d.name,
      'Institution: ' + d.institution,
      'Email: ' + d.email,
      'WhatsApp: ' + d.whatsapp,
      'Protein: ' + d.pdb,
      'Length: ' + d.length,
      'Analysis: ' + (d.analysis || []).join(', '),
      'Deadline: ' + d.deadline,
      'Notes: ' + d.notes,
      'Files: ' + (links.join('\n') || 'none'),
    ].join('\n'),
  });

  return ContentService.createTextOutput('ok');
}
```

The browser posts with `mode: "no-cors"`, so Apps Script never has to return
CORS headers — but it also means the browser cannot read the response. The UI
therefore shows success once the request is dispatched. Watch the Sheet for a
few days after launch to confirm submissions are actually arriving.

> Apps Script quotas: `MailApp` is capped at 100 recipients/day on a consumer
> Gmail account — the same limit the olympiad site runs into. Well above
> expected quotation volume, but worth knowing.

## 2. Build

```bash
npm ci && npm run build
```

Output lands in `out/`. To regenerate the figures, sample report and social card
from the source PNGs in the parent folder:

```bash
npm run assets
```

`npm run assets` reads `../MD figures` and `../MMPBSA figures`, so run it from
this directory with those folders in place. The generated files are committed,
so a normal build does not need them.

## 3. Upload to Hostinger

1. Zip the **contents** of `out/` (not the `out` folder itself).
2. hPanel → **Files → File Manager** → open `public_html` for the
   `services.biopc.org` subdomain.
3. Delete the previous contents, upload the zip, and extract in place.

`trailingSlash: true` is set in `next.config.ts`, so every route is a real
`index.html` inside its own directory. That means no rewrite rules are needed
and deep links resolve correctly on Apache.

### Subdomain DNS

In hPanel → **Domains → Subdomains**, create `services` under `biopc.org` and
point its document root at the folder you uploaded to. If DNS is managed
elsewhere, add:

```
services   CNAME   biopc.org.
```

`public/CNAME` is included for GitHub Pages compatibility; Hostinger ignores it
and it is harmless to leave in place.

## 4. Post-deploy checks

- `https://services.biopc.org/` loads over HTTPS (enable the free SSL cert in
  hPanel first — the site is linked as `https://` throughout).
- `/BioPC-Sample-MD-Report.pdf` downloads.
- `/sitemap.xml` and `/robots.txt` resolve.
- Submit the quotation form once and confirm the row lands in the Sheet.
- Paste the URL into the [Facebook sharing debugger][fb] to warm the OG cache.
- Submit the sitemap in Google Search Console.

[fb]: https://developers.facebook.com/tools/debug/

## Project layout

```
site/
├── public/figures/        15 optimised WebP figures + thumbnails
├── public/BioPC-Sample-MD-Report.pdf
├── scripts/               asset generators (sharp, pdf-lib)
├── src/lib/site.ts        ALL page copy and data — edit content here
├── src/components/        ProteinScene, TrajectoryField, Reveal, sections/
└── src/app/               layout, page, sitemap, robots
```

Nearly all copy edits are single-line changes in `src/lib/site.ts`.
See [REPLACE-BEFORE-LAUNCH.md](REPLACE-BEFORE-LAUNCH.md) first.
