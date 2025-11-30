## Travel Accounting MERN App (Local Testing)

### 1. Prerequisites

- Node.js and npm installed.
- MongoDB running locally on `mongodb://127.0.0.1:27017`.

### 2. Backend setup (`backend`)

1. Open a terminal:
   - `cd /home/kali/Desktop/Acounting/backend`
2. Create a `.env` file in `backend` with:
   - `MONGO_URI=mongodb://127.0.0.1:27017/travel_accounting`
   - `PORT=5000`
3. Install dependencies (already done if you followed steps above, otherwise):
   - `npm install`
4. Start development server:
   - `npm run dev`
5. Health check:
   - Open `http://localhost:5000/health` in your browser; it should return `{ "status": "ok" }`.

### 3. Frontend setup (`frontend`)

1. Open another terminal:
   - `cd /home/kali/Desktop/Acounting/frontend`
2. Create a `.env` file in `frontend` (optional if using default):
   - `VITE_API_BASE_URL=http://localhost:5000`
3. Install dependencies (already done if you followed steps above, otherwise):
   - `npm install`
4. Start the React app:
   - `npm run dev`
5. Open the app:
   - Visit the URL Vite prints, usually `http://localhost:5173`.

### 4. Basic testing flow

Once both servers are running:

- In the browser, go to `http://localhost:5173`.
- On the left sidebar:
  - Use **Dashboard** and click **Check API health** to confirm frontend ↔ backend connection.
  - Use **Daily Entries**, **Customers**, **Invoices**, **Payments**, **Reports**, and **Reminders** sections as we expand them.

For API-level testing, you can also use a tool like Postman or Thunder Client:

- `GET http://localhost:5000/api/customers`
- `POST http://localhost:5000/api/customers`
- `POST http://localhost:5000/api/bookings`
- `POST http://localhost:5000/api/invoices/from-booking/:bookingId`

### 5. Build commands

- Backend:
  - `cd backend`
  - `npm run build`
  - `npm start` (runs compiled `dist/server.js`)
- Frontend:
  - `cd frontend`
  - `npm run build`





