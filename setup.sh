#!/bin/bash

# [SETUP] Red Estampacion - GitHub Setup & Deployment Guide
# Run this script to set up your GitHub repository and deploy to Vercel

echo "[INFO] Red Estampacion - Setup Script"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "[INFO] Initializing git repository..."
    git init
    git branch -M main
else
    echo "[OK] Git repository already initialized"
fi

# Add all files
echo "[INFO] Adding files to git..."
git add .

# Commit
echo "[INFO] Committing changes..."
git commit -m "Production ready: AI-powered fashion e-commerce platform

Features:
- AI Styling Assistant with fallback system
- Smart outfit generation
- Color analysis (colorimetry)
- Virtual closet management
- Bitcoin payment integration
- Multi-language support (EN/ES)
- Admin dashboard
- Automated email system
" || echo "No changes to commit"

echo ""
echo "[INFO] Next steps:"
echo ""
echo "1. Create a GitHub repository:"
echo "   Go to https://github.com/new"
echo "   Repository name: red-estampacion"
echo "   Make it public or private"
echo "   DON'T initialize with README (we already have one)"
echo ""
echo "2. Add GitHub remote:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/red-estampacion.git"
echo ""
echo "3. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "4. Deploy to Vercel:"
echo "   a) Go to https://vercel.com/new"
echo "   b) Import your GitHub repository"
echo "   c) Add environment variables:"
echo "      - DATABASE_URL (Vercel Postgres)"
echo "      - NEXTAUTH_URL (your-domain.vercel.app)"
echo "      - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
echo "      - CLOUDINARY_* (from cloudinary.com)"
echo "      - SMTP_* (optional, for emails)"
echo "      - GEMINI_API_KEY (optional, has fallback)"
echo "   d) Click Deploy!"
echo ""
echo "5. After deployment, run database setup:"
echo "   - In Vercel dashboard, go to Storage > Create Database > Postgres"
echo "   - Copy DATABASE_URL to environment variables"
echo "   - In your local terminal:"
echo "     npx prisma db push --accept-data-loss"
echo "     npx prisma db seed"
echo ""
echo "[DONE] Your app will be live at: https://your-project.vercel.app"
echo ""
