Scraper runner and GitHub Actions

- Run the scraper locally:

```
npm run scrape
```

- The GitHub Actions workflow `.github/workflows/scrape.yml` runs `npm run scrape` daily at 02:00 UTC.

- Configure these repo secrets in GitHub:
  - `DATABASE_URL` — Postgres connection string used by Drizzle
  - `RAPIDAPI_KEY` — (optional) RapidAPI key for `nairobi-stock-exchange-nse.p.rapidapi.com`
  - `RAPIDAPI_HOST` — (optional) RapidAPI host (typically `nairobi-stock-exchange-nse.p.rapidapi.com`)
  - `NSE_BASE_URL` — (optional) override default Nairobi NSE base URL

If you want me to wire a `reports` table and persist reports to the DB, tell me the preferred schema.
