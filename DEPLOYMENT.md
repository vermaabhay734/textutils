# Deploying to GitHub Pages (SPA)

This project is a React Single Page Application (SPA) deployed to GitHub Pages at:
https://vermaabhay734.github.io/textutils/

## Key Steps

1. **Router Setup**
  - Uses `<BrowserRouter basename="/textutils">` in production (GH Pages), and no basename in local dev.
  - Dynamic basename is set in `App.js`:
    ```js
    const isGhPages = window.location.hostname.endsWith("github.io");
    const base = isGhPages ? "/textutils" : undefined;
    <BrowserRouter {...(base ? { basename: base } : {})}> ... </BrowserRouter>
    ```

2. **Navigation**
  - All internal navigation uses React Router `<Link to="...">`.
  - No anchor tags for internal routes.
  - Route paths are relative (e.g., `compare`, not `/compare`).

3. **404.html SPA Fallback**
  - After building, `index.html` is copied to `404.html` in the `build` folder.
  - This ensures deep links (e.g., `/textutils/compare`) load the SPA, not a hard 404.
  - Automated by the postbuild script: `sh ./scripts/copy404.sh`

4. **package.json homepage**
  - Set to `"homepage": "https://vermaabhay734.github.io/textutils"` for correct asset paths.

5. **Catch-all Route**
  - A catch-all route (`*`) renders a redirect to Home via `NotFoundRedirect`.
  - This prevents hard 404s and keeps navigation inside the SPA.

## Manual Test Checklist

- [x] Home page loads at `/textutils/`
- [x] Compare page loads at `/textutils/compare` via SPA navigation
- [x] Refresh on `/textutils/compare` loads Compare page (no GH Pages 404)
- [x] Browser Back/Forward works, state preserved
- [x] All static assets load from `/textutils/...` paths
- [x] No hard reloads or anchor tag navigation for internal routes
- [x] 404.html is present in the published site root

## Deploy Steps

1. Run `npm run deploy` (or your deploy workflow)
2. Confirm `build/404.html` exists before pushing to `gh-pages` branch
3. Visit `/textutils/compare` and refresh to confirm SPA loads

## Troubleshooting
- If you see a hard 404 on deep links, ensure `404.html` is present and matches `index.html` in the published directory.
- If assets fail to load, check the `homepage` field in `package.json`.
- For custom domains, adjust `basename` and asset paths accordingly.
# TextUtils Deployment Guide 📦

This guide provides step-by-step instructions for deploying TextUtils to different platforms.

## GitHub Pages Deployment

### Prerequisites
- Node.js installed (v14 or higher)
- npm installed (v6 or higher)
- A GitHub account
- Git installed on your machine

### Step-by-Step Deployment

1. **Fork or Clone the Repository**
```bash
git clone https://github.com/vermaabhay734/textutils.git
cd textutils
```

2. **Install Dependencies**
```bash
npm install
```

3. **Install GitHub Pages Package**
```bash
npm install --save gh-pages
```

4. **Configure package.json**
Add the following to your package.json:
```json
{
  "homepage": "https://vermaabhay734.github.io/textutils",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

5. **Deploy to GitHub Pages**
```bash
npm run deploy
```

6. **Configure GitHub Repository**
- Go to your repository settings
- Navigate to "Pages"
- Select `gh-pages` branch as source
- Save the settings

Your site will be live at: `https://vermaabhay734.github.io/textutils`

## Local Development Setup

1. **Clone Repository**
```bash
git clone https://github.com/vermaabhay734/textutils.git
```

2. **Navigate to Project Directory**
```bash
cd textutils
```

3. **Install Dependencies**
```bash
npm install
```

4. **Start Development Server**
```bash
npm start
```

The app will run on `http://localhost:3000`

## Environment Variables (if needed)
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=your_api_url
```

## Build for Production

To create a production build:
```bash
npm run build
```

## Troubleshooting

### Common Issues and Solutions

1. **Build Fails**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall dependencies: `npm install`

2. **Deployment Fails**
   - Ensure GitHub repository is public
   - Check if gh-pages branch exists
   - Verify homepage URL in package.json

3. **CORS Issues**
   - Use environment variables for API URLs
   - Configure API server to allow your domain

## CI/CD Setup (Optional)

### GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '14'
      - run: npm ci
      - run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

## Support

If you encounter any issues during deployment:
1. Check the [GitHub Issues](https://github.com/vermaabhay734/textutils/issues)
2. Create a new issue with detailed description
3. Contact the maintainer through GitHub