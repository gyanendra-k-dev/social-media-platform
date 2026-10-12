# Market (MERN)

Buyers shop and keep a cart, sellers upload products with images, one admin manages everything.

## Run locally
1. Backend: `cd backend && cp .env.example .env` (fill in YOUR values), then `npm install && npm run dev`
2. Create the admin once: `npm run seed:admin`
3. Frontend: `cd frontend && cp .env.example .env && npm install && npm run dev`
4. Open http://localhost:5173 and check http://localhost:5000/api/health

## Roles
- buyer: browse, cart, place orders
- seller: everything a buyer does + add/delete own products
- admin: created only by `npm run seed:admin` (password from your env, never in code)

Never commit `.env` files.
