# Vyvera: Plant Shop

A MERN e-commerce site for plants, seeds and pots, with a separate admin panel.

## Features
- Product listing by category, with search
- Cart and user login (JWT)
- Checkout page with shipping details and order summary
- Order placement, saved to MongoDB
- Store locator pulled from the database
- Admin panel to add and remove products

## Tech stack
React (shop: Create React App, admin: Vite), Node.js, Express, MongoDB (Mongoose)

## Setup
1. Clone the repo
2. Copy `backend/.env.example` to `backend/.env` and fill in your values
3. Run each part in its own terminal:

```bash
# Backend
cd backend && npm install && node index.js

# Shop
cd frontend && npm install && npm start

# Admin panel
cd admin/vite-project && npm install && npm run dev
```

## Order flow
1. Add items to the cart
2. Log in
3. Go to checkout, enter shipping details and review the order
4. Place the order, which is stored in the database
