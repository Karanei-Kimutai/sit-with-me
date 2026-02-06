# Sit With Me

A community storytelling and outreach blog built with Next.js App Router, Prisma, and NextAuth. It supports role-based access for publishing posts, rich-text editing, and optional Cloudinary image uploads.

## Features
- Public blog with published posts and post detail pages
- Admin-only story creation with rich-text editor
- Credentials-based authentication with role-aware sessions
- Cloudinary cover image uploads
- PostgreSQL-backed content storage via Prisma

## Tech Stack
- Next.js (App Router)
- React
- Prisma ORM + PostgreSQL
- NextAuth (Credentials provider)
- Tiptap editor
- Tailwind CSS

## Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
Create a `.env` file using the example:
```bash
cp .env.example .env
```

Fill in values for:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

### 3) Prepare the database
Run migrations for your database:
```bash
npx prisma migrate dev
```

### 4) Seed sample data (optional)
The real seed script is confidential. Use the example seed script instead or create your own:
```bash
npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" prisma/exampleseed.ts
```

### 5) Start the dev server
```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables
These are required for local development and production:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Base URL for NextAuth (e.g. `http://localhost:3000`)
- `NEXTAUTH_SECRET`: Secret used to sign NextAuth tokens
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary account name
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: Unsigned upload preset for client-side uploads

## Authentication and Roles
- Auth uses NextAuth Credentials provider.
- Admin-only publishing is enforced in the `createPost` server action.
- The seed script creates an admin user for local testing.

## Example Seed Account (Local)
The example seed script (`prisma/exampleseed.ts`) creates:
- Email: `admin@sitwithme.org`
- Password: `password123`

Change these in your own seed script or create your own admin user for any real environment.

## Scripts
- `npm run dev`: Run the local dev server
- `npm run build`: Run Prisma migrations and build the app
- `npm run start`: Start the production server
- `npm run lint`: Lint the codebase

## Deployment Notes
- Ensure the database is reachable from the deployment environment.
- Run `prisma migrate deploy` during deploys (already included in `npm run build`).
- Set all environment variables in your hosting provider.

## Troubleshooting
- If auth fails, verify `NEXTAUTH_URL` matches the actual site URL.
- If Cloudinary uploads fail, ensure the upload preset is unsigned and the name matches `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
- If Prisma errors occur, run `npx prisma generate` after dependency installs (also runs on `postinstall`).
