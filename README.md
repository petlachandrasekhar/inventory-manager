# Inventory Manager

A MERN inventory application for tracking items, suppliers, stock levels, and low-stock alerts.

## Requirements

- Node.js 18 or newer
- MongoDB local instance or MongoDB Atlas database

## Local setup

### Backend

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Update `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/inventory-manager
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

Start the API:

```powershell
npm run dev
```

The health endpoint is available at `http://localhost:5000/api/health`.

### Frontend

In a second terminal:

```powershell
cd client
npm install
Copy-Item .env.example .env
```

Set `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the client:

```powershell
npm run dev
```

## Production build

Build the frontend:

```powershell
cd client
npm run lint
npm run build
```

Run the backend in production mode after setting production environment variables:

```powershell
cd server
$env:NODE_ENV="production"
npm start
```

CORS accepts requests only from the origin configured in `CLIENT_URL`. The client API base URL comes from `VITE_API_URL`; it does not contain a deployment URL in source code.

## API overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/items`
- `POST /api/items`
- `PUT /api/items/:id`
- `PATCH /api/items/:id/stock`
- `DELETE /api/items/:id`
- `GET /api/items/low-stock`
- `GET /api/suppliers`
- `POST /api/suppliers`
- `PUT /api/suppliers/:id`
- `DELETE /api/suppliers/:id`

Protected endpoints require `Authorization: Bearer <token>`.

## Deployment options

These are suggested hosting choices and are not configured by this repository:

- Backend: Render or Railway
- Frontend: Vercel or Netlify
- Database: MongoDB Atlas

Set the deployed frontend URL as the backend `CLIENT_URL`, and set the deployed API URL as the frontend `VITE_API_URL` during the frontend build.
