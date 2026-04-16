# Email Authentication DNS Checklist (SPF / DMARC / DKIM / DNSSEC)

This repo change can only cover HTTP/security headers. For email authentication (SPF/DMARC/DKIM) and DNSSEC, you must make DNS/provider changes in your DNS host (e.g. Cloudflare, GoDaddy, Namecheap) or your email provider (Google Workspace / Microsoft 365).

## SPF (Sender Policy Framework) - HIGH

Add a DNS TXT record:

- Host/Name: `@`
- Value: `v=spf1 include:_spf.google.com ~all`

Notes:
- If your email provider is not Google Workspace, replace the `include:_spf.google.com` part with your provider’s SPF mechanism.

## DMARC (Domain-based Message Authentication, Reporting & Conformance) - HIGH

Add a DNS TXT record:

- Host/Name: `_dmarc`
- Value: `v=DMARC1; p=quarantine; rua=mailto:you@yourdomain.com`

Recommended (optional) tightening:
- `adkim=s; aspf=s; fo=1; pct=100`
- Example: `v=DMARC1; p=quarantine; rua=mailto:you@yourdomain.com; adkim=s; aspf=s; fo=1; pct=100`

## DKIM (DomainKeys Identified Mail) - MEDIUM

DKIM keys must be generated in your email provider admin panel, then you add the provided DNS TXT/CNAME records.

General steps:
1. In your email provider, generate DKIM keys for your domain.
2. Copy the provided DKIM selector(s) and record(s) into DNS.
3. Wait for propagation, then re-scan.

## DNSSEC - MEDIUM

Enable DNSSEC in your DNS provider/registrar control panel.

General steps:
1. Turn on DNSSEC for the domain.
2. If your registrar requires it, add the DS record(s) that your DNS provider generates.
3. Wait for propagation, then re-scan.

## Verification

After changes:
1. Wait for DNS propagation (often 24–48 hours).
2. Re-run your scan.

