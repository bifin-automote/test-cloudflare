# Cloudflare Workers Express API

This project deploys an Express API to Cloudflare Workers and returns the first 2 documents from MongoDB.

## Local development

1. Copy `.dev.vars.example` to `.dev.vars`.
2. Set `MONGO_URI`, `DB_NAME`, and `COLLECTION_NAME`.
3. Run `npm run dev`.

## Deploy

Provision the required bindings before deploy:

```sh
npx wrangler secret put MONGO_URI
npx wrangler secret put DB_NAME
npx wrangler secret put COLLECTION_NAME
```

Then deploy:

```sh
npm run deploy
```
