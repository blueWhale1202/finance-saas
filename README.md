## Note

-   Handle HTTP exception in Honojs
-   Fetch data on server with react-query
-   Handle react-hook-form with server action

## Database

```bash
# generate sql command
bun db:generate

# migrate db to neon serverless
bun db:migrate

# open drizzle studio
bun db:studio
```

## Setup

```bash
# .env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=

DATABASE_URL=

NEXT_PUBLIC_APP_URL=
```

## Getting Started

First, run the development server:

```bash
bun dev
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
