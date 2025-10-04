# Deployment Instructions

## Deploying to Fly.io

### Prerequisites
1. Install Fly.io CLI: https://fly.io/docs/getting-started/installing-flyctl/
2. Create a Fly.io account
3. Install Node.js and npm

### Deployment Steps

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Login to Fly.io:**
   ```bash
   flyctl auth login
   ```

3. **Launch the app:**
   ```bash
   flyctl launch
   ```
   - Select "Yes" to copy the configuration
   - Choose a unique app name
   - Select a region
   - Choose not to deploy yet

4. **Set environment variables:**
   ```bash
   flyctl secrets set MONGODB_URI="your_mongodb_connection_string"
   flyctl secrets set JWT_SECRET="your_jwt_secret"
   flyctl secrets set ADMIN_EMAIL="admin@example.com"
   flyctl secrets set ADMIN_PASSWORD="your_admin_password"
   ```

5. **Deploy the application:**
   ```bash
   flyctl deploy
   ```

### Environment Variables Required

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `ADMIN_EMAIL` - Admin user email
- `ADMIN_PASSWORD` - Admin user password

### Custom Domain (Optional)

To use a custom domain:
```bash
flyctl certs add yourdomain.com
```

## Local Development

### Running the application locally:

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### Building for production:

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend (serves frontend):**
   ```bash
   cd backend
   npm start
   ```

The application will be available at http://localhost:5000