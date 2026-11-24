# Vyvera: Plant Shop

A MERN e-commerce site for plants, seeds and pots, with a separate admin panel.

## Features
- Product listing by category, with search
- Cart and user login (JWT)
- Store locator pulled from the database
- Admin panel to add and remove products

## Tech stack
React (shop: Create React App, admin: Vite), Node.js, Express, MongoDB (Mongoose)

## Setup
1. Clone the repo
2. Copy `backend/.env.example` to `backend/.env` and fill in your values
3. Run each part in its own terminal:

   cd backend && npm install && node index.js
   cd frontend && npm install && npm start
   cd admin/vite-project && npm install && npm run dev
