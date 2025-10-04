# Vercel Deployment Instructions

## Deploying Frontend and Backend Separately

Vercel works best when deploying frontend and backend as separate projects. Here's how to do it:

## Frontend Deployment (React + Vite)

### 1. Prepare the Frontend
```bash
cd frontend
```

### 2. Update Environment Variables
Create a `.env.production` file in the frontend directory with your backend URL:
```env
VITE_API_URL=https://your-backend-url.vercel.app
```

### 3. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Set the root directory to `frontend`
5. Vercel will automatically detect the Vite project
6. Add environment variables in the Vercel dashboard:
   - `VITE_API_URL` = `https://your-backend-url.vercel.app`

## Backend Deployment (Node.js + Express)

### 1. Prepare the Backend
```bash
cd backend
```

### 2. Update Environment Variables
Set these environment variables in Vercel dashboard:
- `MONGODB_URI` = your MongoDB connection string
- `JWT_SECRET` = your JWT secret
- `ADMIN_EMAIL` = admin email
- `ADMIN_PASSWORD` = admin password
- `FRONTEND_URL` = `https://your-frontend-url.vercel.app`

### 3. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Set the root directory to `backend`
5. Vercel will automatically detect the Node.js project
6. Add environment variables in the Vercel dashboard

## Environment Variables Needed

### Frontend:
- `VITE_API_URL` = URL of your backend API

### Backend:
- `MONGODB_URI` = MongoDB connection string
- `JWT_SECRET` = Secret for JWT tokens
- `ADMIN_EMAIL` = Admin user email
- `ADMIN_PASSWORD` = Admin user password
- `FRONTEND_URL` = URL of your frontend (for CORS)

## Custom Domain Setup

To use custom domains:
1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure `FRONTEND_URL` is set correctly in backend environment variables
2. **API not working**: Ensure the backend URL is correctly set in `VITE_API_URL`
3. **Environment variables not loading**: Check that variables are added in Vercel dashboard, not just local .env files

### Checking Logs:
1. Go to your project in Vercel dashboard
2. Click on "Logs" tab
3. Check for any error messages during build or runtime

### Build Issues:
1. If you see "builds existing" warnings, make sure your vercel.json is properly configured
2. Check that your package.json has the correct build scripts
3. Ensure all dependencies are properly listed in package.json