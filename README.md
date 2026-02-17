
# Rafee AI Pro Studio (No-Build Deployment)

This project is optimized for direct static deployment to **Cloudflare Pages** without requiring a build step or npm.

## How to Deploy

1.  **Push to GitHub**: Upload this folder directly to a new repository on your GitHub account.
2.  **Open Cloudflare Dashboard**: Go to **Workers & Pages**.
3.  **Create a Project**: Click **Create > Pages > Connect to Git**.
4.  **Select Repository**: Choose your repo.
5.  **Build Settings**:
    *   **Framework Preset**: None (Static)
    *   **Build command**: (Leave empty)
    *   **Build output directory**: `/` (Root)
6.  **Environment Variables**:
    *   Add `API_KEY` with your Google Gemini API Key.
7.  **Deploy**: Click **Save and Deploy**.

The site will be live instantly!

## Technical Notes
- Uses **Vanilla JS** and **ES Modules**.
- Uses an **importmap** to handle dependencies in the browser.
- No bundler needed; pure static hosting.
