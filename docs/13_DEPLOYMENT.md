# 13 — Deployment

## Deployment Target

Single Vercel project hosting the entire Next.js application (frontend + `app/api/**` Route Handlers). No separate backend, no Docker, no other hosting provider.

## External Managed Services

| Service | Purpose |
|---|---|
| MongoDB Atlas | Primary database (Mongoose) |
| Cloudinary | Product image storage/delivery |
| Hugging Face Inference API | AI assistant model calls |

## Environment Variables

Define these in Vercel Project Settings → Environment Variables (and locally in `.env.local`, never committed):

```bash
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Auth
AUTH_SECRET=<random-long-secret>          # NextAuth/JWT signing secret
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

# Hugging Face
HUGGINGFACE_API_KEY=<hf-token>
HUGGINGFACE_MODEL=<chosen-model-id>       # e.g. a small instruct model suitable for chat/JSON tasks

# App
NEXT_PUBLIC_APP_URL=https://<your-vercel-domain>.vercel.app
NODE_ENV=production
```

`.env.example` in the repo root should list all keys above with placeholder values (no real secrets).

## Deployment Steps

1. **MongoDB Atlas**: create a free-tier cluster, create a database user, allow network access from anywhere (`0.0.0.0/0`) for hackathon simplicity, copy the connection string into `MONGODB_URI`.
2. **Cloudinary**: create a free account, grab cloud name/API key/secret from the dashboard.
3. **Hugging Face**: create an account, generate an access token with Inference API permissions, choose a hosted model suitable for chat/instruction-following and JSON-structured output.
4. **Repository**: push the Next.js project to GitHub.
5. **Vercel**: import the GitHub repository as a new Vercel project, set the Framework Preset to Next.js, add all environment variables listed above, deploy.
6. **Runtime**: ensure API routes that use Mongoose/Cloudinary/Hugging Face SDKs explicitly set `export const runtime = "nodejs"` (these SDKs are not Edge-compatible).
7. **Verify**: after deploy, hit `/api/products` (should return an empty or seeded list) to confirm the DB connection works in production.
8. **Seed data (optional but recommended)**: run a one-off local script (`scripts/seed.ts`, not part of production routes) against the Atlas connection string to populate a handful of demo suppliers/products before recording the demo video.

## Rollback / Iteration

Vercel keeps prior deployments; if a deploy breaks the demo, redeploy the previous working commit from the Vercel dashboard. No blue/green or staged rollout process is needed for a hackathon submission.

## What Is Explicitly Not Set Up

Per the scope lock: no CI/CD pipeline, no Docker image, no Kubernetes, no separate staging environment, no background workers, no Redis cache, no CDN configuration beyond what Vercel/Cloudinary provide by default.
