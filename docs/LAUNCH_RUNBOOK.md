# Launch runbook (Technical §12, Roadmap Phase E)

Each step names who must do it. Nothing touches the client's DNS until steps 1 and 2 are complete; their company email runs on the same domain (C-02).

## 1. Accounts (owner and client)

- **Vercel Pro** team owned by the client or the Group (TD-03; Hobby is not allowed for commercial use, E-10). Give the developer delegated access.
- **Resend** account owned by the client (TD-04).
- **Google Analytics 4** property (optional, TD-06) and **Google Search Console**, both owned by the client.
- A client-owned **archive mailbox** for `ARCHIVE_BCC` (TD-05).

## 2. Domain inventory (client, Q-01)

1. Identify the registrar account, the DNS host and the mail host for `atharvacorrugations.com`.
2. **Export every DNS record** (A, AAAA, CNAME, MX, TXT including SPF, DKIM and DMARC) and store the export with the client.
3. Note the current TTLs.

## 3. Staging on Vercel (developer)

1. Import the repository; framework preset Next.js. `vercel.json` sets region `bom1` (Mumbai) and the build command `npm run build:vercel`. That runs the **preview** build (every claim shown with the "unverified" banner, `noindex`), unless the environment variable `LAUNCH=true` is set. Set `LAUNCH=true` on the Production environment only at go-live (step 5): it runs the claims gate and hides everything unverified.
2. Environment variables (Production and Preview), from `.env.example`. Never copy Polymers values.
3. Turn on **Deployment Protection** (password) for preview and staging.
4. **Firewall:** add a rate-limit rule for `/api/rfq` and `/api/contact` (for example 10 requests per minute per IP) (Technical §7.6).
5. Resend: add the domain and note the SPF include, DKIM CNAMEs and the DMARC record it asks for. Until the domain is verified, `MAIL_FROM` stays on Resend's test sender.
6. Smoke test on the staging URL: every page; the quote form and contact form send (Resend test sender); `npx tsx scripts/synthetic-rfq.ts` with `SITE_URL` set to staging.

## 4. Go / no-go (owner, gate G7)

- [ ] `docs/QA_CHECKLIST.md`: every **Open** item closed or accepted in writing
- [ ] Trust floor decided (reduced homepage or delay)
- [ ] Privacy policy published (F-66 confirmed, no counsel notes)
- [ ] DNS export stored; rollback steps understood
- [ ] Email send and receive tested on the current setup (baseline)

## 5. Cut-over (developer with client DNS access)

1. 24–48 hours before: lower the TTL on the apex and `www` records to 300 seconds. In Vercel, set `LAUNCH=true` on the Production environment and redeploy. Confirm the claims gate passes and the deployment shows confirmed content only.
2. Add Resend's records. **Merge** the SPF include into the single existing SPF record (only one SPF record is valid); add the DKIM CNAMEs; DMARC `p=none` (monitor) first.
3. Point `www` (canonical) and the apex at Vercel as its domain settings instruct. **Leave the MX records untouched.**
4. In Vercel, set `www.atharvacorrugations.com` as primary and redirect the apex to it.
5. Send and receive test emails on the company mailboxes. Then submit one real quote request and confirm the sales email, the archive copy and the auto-reply.
6. Check HTTPS, the redirect, the security headers, `robots.txt` and `sitemap.xml`.

## 6. Rollback

Restore the exported A and CNAME records for the apex and `www`. Mail is unaffected because MX was never changed. Keep the old hosting account alive until mail is confirmed independent of it.

## 7. After launch (client and developer)

- Verify Search Console (DNS TXT) and Bing Webmaster; submit `https://www.atharvacorrugations.com/sitemap.xml`.
- If GA4 is used: set `NEXT_PUBLIC_GA_ID`, redeploy, and mark `rfq_submit_success` and `whatsapp_click` as key events in GA admin.
- Set the GitHub repository variable `SITE_URL` to switch on the weekly synthetic test.
- Uptime monitor on `/` and `/api/rfq` (free tier).
- Raise DMARC to `quarantine` after two clean weeks of reports.
- Post-launch reviews at week 1, day 30, 60 and 90 (Roadmap §8). Claim expiry: ISO certificate valid to 1 Sep 2028.
