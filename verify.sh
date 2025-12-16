#!/bin/bash

echo "[INFO] RED ESTAMPACION - VERIFICATION SCRIPT"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "[CHECK] Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}[OK] Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}[ERROR] Node.js not found${NC}"
    exit 1
fi

# Check npm
echo ""
echo "[CHECK] Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}[OK] npm installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}[ERROR] npm not found${NC}"
    exit 1
fi

# Check .env.local
echo ""
echo "[CHECK] Checking .env.local..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}[OK] .env.local exists${NC}"
    
    # Check for required vars
    REQUIRED_VARS=("DATABASE_URL" "NEXTAUTH_SECRET" "GOOGLE_CLIENT_ID" "SMTP_USER" "CLOUDINARY_API_KEY" "ADMIN_EMAIL")
    
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "$var" .env.local; then
            echo -e "  ${GREEN}[OK]${NC} $var configured"
        else
            echo -e "  ${YELLOW}[WARN]${NC} $var missing"
        fi
    done
else
    echo -e "${RED}[ERROR] .env.local not found${NC}"
    exit 1
fi

# Check dependencies
echo ""
echo "[CHECK] Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}[OK] node_modules exists${NC}"
else
    echo -e "${YELLOW}[WARN]${NC} node_modules not found"
    echo "   Run: npm install"
fi

# Check Prisma
echo ""
echo "[CHECK] Checking Prisma..."
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${GREEN}[OK] prisma/schema.prisma exists${NC}"
else
    echo -e "${RED}[ERROR] Prisma schema not found${NC}"
fi

# Check key files
echo ""
echo "[CHECK] Checking key files..."
KEY_FILES=(
    ".env.local"
    ".env.example"
    "prisma/schema.prisma"
    "lib/email/mailer.ts"
    "lib/email/templates.ts"
    "lib/cron/jobs.ts"
    "components/ImageUpload.tsx"
    "app/api/auth/[...nextauth]/route.ts"
)

for file in "${KEY_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}[OK]${NC} $file"
    else
        echo -e "  ${YELLOW}[MISSING]${NC} $file"
    fi
done

# Summary
echo ""
echo "========================================"
echo -e "${GREEN}[DONE] Verification Complete!${NC}"
echo ""
echo "[INFO] Next Steps:"
echo "1. Run: npm run build"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "[INFO] Email Test:"
echo "  - Create an order to test email confirmation"
echo "  - Check inbox: santy8aposso@gmail.com"
echo ""
echo "[INFO] Cloudinary Test:"
echo "  - Go to /admin/productos/nuevo"
echo "  - Try uploading an image"
echo ""
echo "[INFO] Google OAuth Test:"
echo "  - Click 'Iniciar sesión'"
echo "  - Try logging in with Google"
echo ""
