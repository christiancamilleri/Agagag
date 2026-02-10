# IRRIGOLD — Vercel + Stripe Checkout

## Struttura
- `index.html` (pagina prodotto)
- `success.html`
- `api/create-checkout.js` (Vercel Serverless Function)

## Deploy
1) Carica questa repo su GitHub
2) Vercel -> New Project -> Import repo
3) Project Settings -> Environment Variables:
   - STRIPE_SECRET_KEY
   - STRIPE_PRICE_IRRIGOLD_2 ... STRIPE_PRICE_IRRIGOLD_6
4) Redeploy

## Test
Apri: `/api/create-checkout`
- da browser deve rispondere **405 Method Not Allowed** (ok)
