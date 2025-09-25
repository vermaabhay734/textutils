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