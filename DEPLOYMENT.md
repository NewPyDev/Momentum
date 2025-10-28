# Deployment Guide

This guide covers deploying Momentum to production environments.

## Frontend Deployment (Vercel)

1. **Connect Repository**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Import the `frontend` directory

2. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
   NEXT_PUBLIC_PADDLE_VENDOR_ID=your_paddle_vendor_id
   NEXT_PUBLIC_PADDLE_ENVIRONMENT=live
   NEXT_PUBLIC_GOOGLE_ADSENSE_ID=your_adsense_id
   ```

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

## Backend Deployment (Railway/Render)

### Railway

1. **Connect Repository**
   - Connect your GitHub repository
   - Select the `backend` directory

2. **Environment Variables**
   ```
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   SECRET_KEY=your-production-secret-key
   PADDLE_VENDOR_ID=your_paddle_vendor_id
   PADDLE_API_KEY=your_paddle_api_key
   PADDLE_WEBHOOK_SECRET=your_webhook_secret
   PADDLE_ENVIRONMENT=live
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

3. **Database**
   - Add PostgreSQL plugin
   - Database will be automatically configured

### Render

1. **Create Web Service**
   - Connect repository
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Add PostgreSQL Database**
   - Create PostgreSQL database
   - Copy connection string to `DATABASE_URL`

## Database Setup (Supabase/Neon)

### Supabase

1. **Create Project**
   - Go to supabase.com
   - Create new project
   - Copy database URL

2. **Environment Variables**
   ```
   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```

### Neon

1. **Create Database**
   - Go to neon.tech
   - Create new database
   - Copy connection string

## Payment Setup (Paddle)

1. **Create Paddle Account**
   - Sign up at paddle.com
   - Complete verification

2. **Create Product**
   - Create subscription product
   - Set pricing and billing cycle

3. **Configure Webhooks**
   - Add webhook URL: `https://your-backend-url.com/api/v1/payments/webhook`
   - Select events: `subscription_created`, `subscription_cancelled`

4. **Environment Variables**
   ```
   PADDLE_VENDOR_ID=your_vendor_id
   PADDLE_API_KEY=your_api_key
   PADDLE_WEBHOOK_SECRET=your_webhook_secret
   PADDLE_ENVIRONMENT=live
   ```

## Monitoring & Analytics

### Error Tracking
- Add Sentry for error tracking
- Configure alerts for critical errors

### Analytics
- Google Analytics for user tracking
- Paddle analytics for payment metrics

### Performance
- Vercel Analytics for frontend performance
- Database monitoring for backend performance

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong SECRET_KEY
- [ ] Configure CORS properly
- [ ] Validate Paddle webhooks
- [ ] Use environment variables for secrets
- [ ] Enable database SSL
- [ ] Set up rate limiting
- [ ] Configure CSP headers

## Scaling Considerations

### Database
- Use connection pooling
- Add read replicas for heavy read workloads
- Consider database indexing optimization

### Backend
- Use Redis for caching
- Implement rate limiting
- Add health checks

### Frontend
- Enable Vercel Edge Functions
- Optimize images and assets
- Use CDN for static content