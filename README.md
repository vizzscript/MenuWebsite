# Liquor Menu Listing Web App

A premium-look web application for browsing liquor menus, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **Mobile Entry**: Simple access by entering a mobile number.
- **Browse Menu**: View liquor details including brand, price, and availability.
- **Filters**: Filter by Category (Whisky, Vodka, etc.) and Price Range.
- **Search**: Find specific liquors by name.
- **Premium UI**: Dark-themed, responsive design with glassmorphism effects.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, Framer Motion, Axios, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Running locally or Atlas URI)

### 1. Backend Setup
Navigate to the `server` directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Configure Environment:
Create a `.env` file in `server/` if it doesn't exist:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/liquor-app
```

Seed Database (Optional):
Populate the database with sample liquor data:
```bash
node seeder.js
```

Start the Server:
```bash
npm run dev
```
Server runs on `http://localhost:5000`.

### 2. Frontend Setup
Navigate to the `client` directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Start the Development Server:
```bash
npm run dev
```
The app will open at `http://localhost:5173`.

## Folder Structure
- `server/`: Backend API and Database logic.
- `client/`: Frontend React Application.

## API Documentation
- **POST** `/api/auth/login`: `{ mobileNumber: "1234567890" }`
- **GET** `/api/liquors`: Get all liquors (Supports query params: `category`, `search`, `minPrice`, `maxPrice`).
- **GET** `/api/liquors/:id`: Get liquor details.
