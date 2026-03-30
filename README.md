# Vercel Deployment Instructions

This project is configured for deployment on Vercel.

## Deployment Steps

1. **Push to GitHub**: Push your code to a GitHub repository.
2. **Import to Vercel**: Go to [Vercel](https://vercel.com) and import your repository.
3. **Configure Environment Variables**:
   - Add `GEMINI_API_KEY` with your Google Gemini API key.
4. **Deploy**: Vercel will automatically detect the Vite configuration and the `api/` directory.

## Project Structure for Vercel

- **Frontend**: Built using `npm run build` (Vite). Served statically from `dist/`.
- **Backend**: Express API routes are located in `api/index.ts` and served as Vercel Serverless Functions.
- **Routing**: `vercel.json` handles routing `/api/*` requests to the backend function.
