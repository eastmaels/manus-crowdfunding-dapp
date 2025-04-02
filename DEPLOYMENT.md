# GitHub Pages Deployment Instructions

This document provides step-by-step instructions for deploying the Crowdfunding dApp to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed on your local machine
- Node.js and npm installed

## Deployment Steps

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Name your repository (e.g., "crowdfunding-dapp")
4. Choose whether to make it public or private
5. Click "Create repository"

### 2. Initialize Git and Push Code to GitHub

```bash
# Navigate to your project directory
cd /path/to/crowdfunding-dapp

# Initialize Git repository (if not already initialized)
git init

# Add all files to Git
git add .

# Commit the changes
git commit -m "Initial commit"

# Add the remote GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/crowdfunding-dapp.git

# Push the code to GitHub
git push -u origin main
```

Note: If your default branch is named "master" instead of "main", use `git push -u origin master` instead.

### 3. Deploy to GitHub Pages

The project is already configured for GitHub Pages deployment. You can deploy it using one of the following methods:

#### Method 1: Deploy using npm

```bash
# Run the deploy script
npm run deploy
```

This will build the application and push it to the `gh-pages` branch of your repository.

#### Method 2: Deploy using GitHub Actions

1. Create a `.github/workflows` directory in your project
2. Create a file named `deploy.yml` in that directory with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # or master, depending on your default branch

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: build
```

3. Commit and push this file to your repository
4. GitHub Actions will automatically build and deploy your application when you push to the main branch

### 4. Configure GitHub Pages Settings

1. Go to your GitHub repository
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. For "Source", select the `gh-pages` branch
5. Click "Save"

### 5. Access Your Deployed Application

After a few minutes, your application will be available at:
`https://YOUR_USERNAME.github.io/crowdfunding-dapp/`

## Troubleshooting

- If you encounter a blank page, check the browser console for errors
- Ensure that the "homepage" field in package.json is set correctly
- Verify that the 404.html and index.html files contain the correct routing scripts
- Make sure your repository is public, or you have GitHub Pages enabled for private repositories

## Updating Your Deployed Application

To update your application after making changes:

1. Commit your changes to your local repository
2. Push the changes to GitHub
3. Run `npm run deploy` again, or let GitHub Actions deploy it automatically if you're using that method
