#!/bin/bash

# 🚀 Red Estampación - GitHub Setup & Deployment Guide
# Run this script to set up your GitHub repository and deploy to Vercel

echo "🎨 Red Estampación - Setup Script"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    git branch -M main
else
    echo "✅ Git repository already initialized"
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Commit
echo "💾 Committing changes..."
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
echo "🌐 Next steps:"
echo ""
echo "1️⃣  Create a GitHub repository:"
echo "   Go to https://github.com/new"
echo "   Repository name: red-estampacion"
echo "   Make it public or private"
echo "   DON'T initialize with README (we already have one)"
echo ""
echo "2️⃣  Add GitHub remote:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/red-estampacion.git"
echo ""
echo "3️⃣  Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "4️⃣  Deploy to Vercel:"
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
echo "5️⃣  After deployment, run database setup:"
echo "   - In Vercel dashboard, go to Storage > Create Database > Postgres"
echo "   - Copy DATABASE_URL to environment variables"
echo "   - In your local terminal:"
echo "     npx prisma db push --accept-data-loss"
echo "     npx prisma db seed"
echo ""
echo "✨ Your app will be live at: https://your-project.vercel.app"
echo ""
