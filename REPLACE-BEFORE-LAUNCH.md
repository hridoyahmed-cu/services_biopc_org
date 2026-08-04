# Replace before launch

The site is complete and deployable, but four blocks of content were written as
realistic **placeholders** so the layout could be built. They are not real
records. Publishing invented publication credits, client quotes or university
affiliations misrepresents the business and is a legal risk — replace or delete
each one before the site goes live.

All four live in [`src/lib/site.ts`](src/lib/site.ts).

| Constant | What to do |
| --- | --- |
| `PUBLICATIONS` | Replace with papers BioPC genuinely contributed to. Add a `doi` field and link the titles if you want them clickable. Delete any you cannot cite. |
| `TESTIMONIALS` | Replace with quotes you have written permission to publish. If you have none yet, delete the constant and remove `<Testimonials>` from `Credibility.tsx` — an empty section is better than an invented one. |
| `AFFILIATIONS` | Replace with institutions of real past clients. Note that naming a client's institution can itself be disclosive; get permission. |
| `METRICS` | Verify the four numbers (projects completed, papers supported, longest run, average turnaround). The hero repeats "9 days" and "5 µs" in `Hero.tsx` — keep them in sync. |

## Also check

- **`src/lib/site.ts` → `SITE.facebook`** points at `facebook.com/biopclab`. Confirm
  that is the correct page URL.
- **Sample report figures** (`public/BioPC-Sample-MD-Report.pdf`) come from a real
  TLR4 / vaccine-construct project, and the chain labels **"TLR4"** and
  **"Vaccine"** are legible in Figures 1, 2 and 6. The report calls the study
  "anonymised". Either confirm you have permission to show that project, or
  regenerate the figures with generic chain labels (`Receptor` / `Ligand`) and
  re-run `npm run assets:report`.
- The same labels appear in the on-page gallery images.

## Quotation form endpoint

The form posts to `NEXT_PUBLIC_QUOTE_ENDPOINT`. Until that is set it falls back
to opening the user's mail client — functional, but you lose file attachments
and the submission log. See [DEPLOY.md](DEPLOY.md) for the Apps Script setup.
