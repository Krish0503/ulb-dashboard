# Deployment Guide for ULB Dashboard

This guide provides instructions for deploying the ULB Dashboard application using different hosting services.

## Prerequisites

- Node.js (version 18 or higher)
- npm (version 8 or higher)
- Git

## Build for Production

Before deploying, build the application for production:

```bash
npm run build
```

This will create a `dist` directory with the production-ready files.

## Deployment Options

### 1. Netlify

Netlify is a popular hosting service for static websites and React applications.

#### Deploy with Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize and deploy:
   ```bash
   netlify init
   netlify deploy --prod
   ```

#### Deploy with Netlify UI

1. Go to [Netlify](https://app.netlify.com/)
2. Sign up or log in
3. Click "New site from Git"
4. Connect to your Git provider and select the repository
5. Set build command to `npm run build`
6. Set publish directory to `dist`
7. Click "Deploy site"

### 2. GitHub Pages

You can use GitHub Pages to host your application directly from your GitHub repository.

1. Push your code to GitHub
2. Enable GitHub Pages in your repository settings
3. The included GitHub Actions workflow will automatically deploy your application

### 3. Vercel

Vercel is another excellent platform for deploying React applications.

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to complete the deployment

### 4. Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase:
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as a single-page app

4. Deploy:
   ```bash
   firebase deploy --only hosting
   ```

## Environment Variables

If your application uses environment variables, make sure to configure them in your hosting provider:

- Netlify: Environment variables can be set in the site settings
- Vercel: Environment variables can be set in the project settings
- Firebase: Use Firebase Functions config

## Troubleshooting

### 404 Errors on Page Refresh

If you encounter 404 errors when refreshing the page or accessing routes directly, you need to configure your hosting service to redirect all requests to `index.html`.

- For Netlify: This is already configured in the `netlify.toml` file
- For other services, you may need to add similar configuration

### Build Errors

If you encounter build errors related to TypeScript, you may need to adjust the TypeScript configuration or fix type errors in the codebase.

## Custom Domain

All the mentioned hosting services support custom domains. Refer to their documentation for setting up a custom domain for your deployed application.