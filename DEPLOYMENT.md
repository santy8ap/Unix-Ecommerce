# 🚀 Quick Deployment Guide

## GitHub Setup (5 minutes)

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `red-estampacion` (or your preferred name)
3. Choose Public or Private
4. **DO NOT** initialize with README (we already have one)
5. Click "Create repository"

### Step 2: Connect & Push
```bash
# Add your GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/red-estampacion.git

# Push to GitHub
git push -u origin main
```

**Done!** Your code is now on GitHub ✅

---

## Vercel Deployment (10 minutes)

### Step 1: Import Project
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your `red-estampacion` repository
4. Click "Import"

### Step 2: Configure Environment Variables

Click on "Environment Variables" and add:

#### Required:
```
DATABASE_URL=postgresql://...  (Get from Vercel Postgres after creating DB)
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=  (Generate: openssl rand -base64 32)
```

#### For Images:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

#### Optional (emails):
```
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

#### Optional (AI - has fallback):
```
GEMINI_API_KEY=your-gemini-key
```

#### Optional (Bitcoin):
```
COINBASE_COMMERCE_API_KEY=your-coinbase-key
```

### Step 3: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. ✅ Your app is live!

### Step 4: Setup Database
1. In Vercel Dashboard → Storage → Create Database → Postgres
2. Copy the `DATABASE_URL` 
3. Add it to Environment Variables
4. Redeploy or run migrations:

```bash
# From your local machine
npx prisma generate
npx prisma db push
npx prisma db seed
```

---

## Checking Your Deployed Site

### Visit your site:
```
https://your-project-name.vercel.app
```

### Admin Access:
```
URL: https://your-project.vercel.app/admin
Email: admin@unix.com
Password: admin123
```
**⚠️ Change this password immediately!**

---

## Troubleshooting

### Database Connection Issues
- Make sure `DATABASE_URL` is set in Vercel
- Check that Postgres database is created
- Verify migrations ran: `npx prisma db push`

### Images Not Loading
- Verify Cloudinary credentials
- Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set

### 500 Errors
- Check Vercel logs: Dashboard → Your Project → Deployments → (click latest) → Functions
- Look for error messages

---

## Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS instructions
4. Update `NEXTAUTH_URL` to your custom domain
5. Redeploy

---

## Updating Your Deployed Site

```bash
# Make changes locally
git add .
git commit -m "Your update message"
git push

# Vercel auto-deploys on push!
```

---

**🎉 You're all set!**

Need help? Check the full README.md or create an issue on GitHub.
