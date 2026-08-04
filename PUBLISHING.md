# Publishing services.biopc.org

> Supersedes `DEPLOY.md`, which described the old manual-upload-to-Hostinger
> flow. That file can be deleted.

The site is a **static export** — `npm run build` writes plain HTML, CSS, JS and
assets to `out/`. GitHub Actions builds and publishes it to GitHub Pages on
every push to `main`, so **you never upload anything to Hostinger for this
subdomain again**.

```
edit a file  ->  git push  ->  Actions builds  ->  live at services.biopc.org
```

Your other Hostinger sites are untouched; only the `services` subdomain moves.

---

## One-time setup

### 1. Create the GitHub repository

On github.com, create a **new empty repository** named `services-biopc-org`
(or anything you like). Do **not** tick "Add a README", .gitignore or licence —
this folder is already a git repo with commits, and an extra initial commit on
GitHub's side would need merging before you could push.

Then, from this directory:

```bash
git remote add origin https://github.com/Hridoy455/services-biopc-org.git
```

```bash
git push -u origin main
```

### 2. Turn on Pages

Repository -> **Settings -> Pages** -> under *Build and deployment*, set
**Source: GitHub Actions**. Not "Deploy from a branch" — the workflow publishes
the built artifact directly.

The first push triggers the build. Watch it in the **Actions** tab; you can also
re-run it any time with *Run workflow*.

### 3. Point the DNS at GitHub

Wherever `biopc.org` DNS is managed (Hostinger hPanel -> **Domains -> DNS Zone**
if it lives there), add:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `services` | `hridoy455.github.io.` |

**Delete any existing `A` or `CNAME` record for `services` first.** A leftover
record pointing at Hostinger will win, and you will keep seeing the old site
while wondering why the deploy "didn't work".

Propagation takes anywhere from a few minutes to a few hours.

### 4. Set the custom domain and enable HTTPS

Repository -> **Settings -> Pages -> Custom domain** -> enter
`services.biopc.org` and save. GitHub verifies the DNS record, after which the
**Enforce HTTPS** checkbox becomes available — tick it. The certificate is
issued automatically and is free.

`public/CNAME` already contains `services.biopc.org`, so the custom domain
survives every redeploy. Do not delete that file.

---

## Day-to-day

Edit, commit, push. That is the entire workflow:

```bash
git add -A && git commit -m "Update packages table" && git push
```

The Actions tab shows the build; the live site updates a minute or two later.
Almost every copy change is a one-line edit in `src/lib/site.ts`.

To preview locally before pushing:

```bash
npm run dev
```

### Regenerating figures, the sample report or the OG card

```bash
npm run assets
```

This reads `../MD figures` and `../MMPBSA figures`, so it only works on your
machine with those folders in place — which is exactly why the generated files
are committed and CI never runs it. Commit the regenerated output.

---

## Quotation form

The form posts to a Google Apps Script web app. The endpoint lives in
`.env.production` and is committed on purpose: `NEXT_PUBLIC_*` values are
inlined into the client bundle, so the URL is public no matter where you store
it. Treat it as public and do the validation inside the script.

The receiver is [`apps-script/Code.gs`](apps-script/Code.gs), kept in the repo
so it is version-controlled alongside the form that calls it.

**Paste it into the Apps Script editor as raw JavaScript.** Do not include a
markdown fence line (three backticks followed by the word `javascript`) — that
is what produced `ReferenceError: javascript is not defined` on line 1.

Setup, in order:

1. Fill in `SHEET_ID` (the long string in your Sheet's URL) and `FOLDER_ID` (the
   Drive folder for uploaded structures — leave it `''` to skip file saving).
2. **Run > setup** once and grant permissions. It creates the header row, checks
   the Drive folder and sends one test email, so the consent prompt happens now
   rather than on a real visitor's submission.
3. **Deploy > New deployment > Web app**, *Execute as: Me*, *Who has access:
   Anyone*.
4. Copy the `/exec` URL into `.env.production`, then commit and push.

> **After every edit to the script**, use *Deploy > Manage deployments > pencil
> icon > Version: New version*. Skipping this means the `/exec` URL keeps
> serving the old code — the single most common reason a fix appears not to work.

### Two errors that are not bugs

- **`Cannot read properties of undefined (reading 'postData')`** — you pressed
  Run on `doPost` in the editor. `doPost` needs a real HTTP request. Run
  `setup` instead to test.
- **The website always shows "Request received"** — the browser posts with
  `mode: "no-cors"`, because Apps Script cannot send CORS headers, so the page
  genuinely cannot read the response. Confirm delivery in the Sheet, and keep an
  eye on it for the first few days after launch.

> Apps Script quota: `MailApp` allows 100 recipients/day on a consumer Gmail
> account — the same cap the olympiad site runs into. Far above expected
> quotation volume, but worth knowing.

---

## Post-launch checks

- `https://services.biopc.org/` loads with a valid certificate.
- `/BioPC-Sample-MD-Report.pdf` downloads.
- `/sitemap.xml` and `/robots.txt` resolve.
- Submit the form once and confirm the row lands in the Sheet.
- Paste the URL into the [Facebook sharing debugger][fb] to warm the OG cache.
- Submit the sitemap in Google Search Console.

[fb]: https://developers.facebook.com/tools/debug/

---

## If you ever want to go back to Hostinger

Nothing is lost. Run `npm run build`, zip the **contents** of `out/` (not the
`out` folder itself) and extract into the subdomain's `public_html`.
`trailingSlash: true` means every route is a real `index.html` in its own
directory, so Apache needs no rewrite rules.

---

## Project layout

```
.
|- .github/workflows/deploy.yml   build + publish to Pages
|- apps-script/Code.gs            quotation form receiver
|- public/figures/                15 optimised WebP figures + thumbnails
|- public/BioPC-Sample-MD-Report.pdf
|- public/CNAME                   services.biopc.org - do not delete
|- scripts/                       asset generators (sharp, pdf-lib)
|- src/lib/site.ts                ALL page copy and data - edit content here
|- src/components/                ProteinScene, TrajectoryField, sections/
`- src/app/                       layout, page, sitemap, robots
```

Read [REPLACE-BEFORE-LAUNCH.md](REPLACE-BEFORE-LAUNCH.md) before going live —
the publications, testimonials, affiliations and headline metrics are
placeholders.
