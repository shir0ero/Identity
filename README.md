# BiteSpeed Identity Reconciliation

A Node.js + TypeScript service for contact identity reconciliation.

## Tech Stack

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL

## Project Structure

```
bitespeed-identity/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   └── identifyController.ts
│   ├── routes/
│   │   └── identifyRoutes.ts
│   ├── services/
│   │   └── contactService.ts
│   ├── utils/
│   │   ├── findRoot.ts
│   │   └── prisma.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── package.json
└── README.md
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<db>?sslmode=require"
```

## Installation & Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

3. Push schema to database:

   ```bash
   npx prisma db push
   ```

4. Run in development mode:

   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` — Start development server with auto-reload
- `npm run build` — Compile TypeScript to `dist/`
- `npm start` — Run compiled server from `dist/server.js`
- `npm run prisma:generate` — Generate Prisma client
- `npm run prisma:migrate` — Run Prisma migrations (dev)

## API

### `POST /identify`

Base URL (local): `http://localhost:3000`

#### Request Body

At least one of `email` or `phoneNumber` is required.

```json
{
  "email": "test@gmail.com",
  "phoneNumber": "123456"
}
```

#### Success Response (`200`)

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["test@gmail.com"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

#### Error Response (`400`)

```json
{
  "error": "Provide email or phoneNumber"
}
```

## Reconciliation Logic (Summary)

1. Find contacts matching email and/or phone number.
2. If no match exists, create a new **primary** contact.
3. Resolve each match to its root primary contact.
4. Select the oldest root as the final primary.
5. Convert any other primary roots to **secondary** linked to final primary.
6. If incoming email/phone is new, create a new secondary contact.
7. Return consolidated contact response.

## Local Testing (Postman)

1. Method: `POST`
2. URL: `http://localhost:3000/identify`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):

```json
{
  "email": "test@gmail.com",
  "phoneNumber": "123456"
}
```

## Build for Production

```bash
npm run build
npm start
```
