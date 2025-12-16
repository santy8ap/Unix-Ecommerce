# Red Estampacion - AI-Powered Fashion E-commerce

A next-generation e-commerce platform for fashion and streetwear, featuring AI-powered styling assistance, personalized outfit generation, and advanced color analysis.

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=flat-square&logo=next.jsamp;logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.22.0-teal?style=flat-square&logo=prisma&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

### AI Styling Assistant

- **Conversational AI Chat**: Get personalized fashion advice powered by intelligent fallback systems
- **Smart Outfit Generation**: AI creates complete outfits from your catalog based on preferences
- **Style Detection**: Automatically identifies your style (Anime, Streetwear, Formal, Casual, etc.)
- **Preference Learning**: Saves and learns from your interactions

### Advanced Personalization

- **Color Analysis (Colorimetry)**: Discover which colors suit you best based on skin tone
- **Virtual Closet**: Organize and manage your wardrobe digitally
- **Smart Product Recommendations**: AI-powered suggestions based on your style and history

### Complete E-commerce

- **Product Catalog**: Browse streetwear, anime merch, and fashion items
- **Shopping Cart & Wishlist**: Seamless shopping experience
- **Order Management**: Full order tracking and history
- **User Reviews**: Rate and review products
- **Related Products**: Smart product suggestions

### Multiple Payment Methods

- **Credit/Debit Cards**: Secure payment processing
- **Bitcoin (BTC)**: Cryptocurrency payment integration via Coinbase Commerce
- **Future-ready**: Extensible payment system

### Advanced Communication

- **Automated Emails**: Order confirmations, welcome messages
- **Cron Jobs**: Daily reports, cart reminders, data cleanup
- **Real-time Notifications**: Stay updated on order status

### User Experience

- **Dark/Light Theme**: Elegant design with theme switching
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Multi-language**: i18n support (Spanish/English)
- **Glassmorphism UI**: Modern, premium design aesthetic
- **Smooth Animations**: Powered by Framer Motion

## Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with glassmorphism
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend

- **API**: Next.js API Routes
- **Database**: PostgreSQL (Vercel Postgres)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **File Upload**: Cloudinary
- **Email**: Nodemailer

### AI & External Services

- **AI**: Google Gemini API (with intelligent fallback)
- **Payments**: Coinbase Commerce (Bitcoin)
- **Hosting**: Vercel
- **Storage**: Vercel Postgres

## Installation

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/red-estampacion.git
   cd red-estampacion
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env` file:

   ```env
   # Database
   DATABASE_URL="postgresql://..."

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-here"

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"

   # Email (optional)
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"

   # Google Gemini (optional - has fallback)
   GEMINI_API_KEY="your-gemini-key"

   # Coinbase Commerce (optional)
   COINBASE_COMMERCE_API_KEY="your-coinbase-key"
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
red-estampacion/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── ai/           # AI endpoints (chat, outfits, vision)
│   │   ├── auth/         # Authentication
│   │   ├── products/     # Product management
│   │   ├── orders/       # Order processing
│   │   └── ...
│   ├── (auth)/           # Auth pages (login, register)
│   ├── admin/            # Admin dashboard
│   ├── ai-stylist/       # AI styling assistant
│   ├── productos/        # Product catalog
│   └── ...
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── navbar/           # Navigation
│   └── ...
├── lib/                   # Utilities and helpers
│   ├── ai/               # AI logic (vision, chat)
│   ├── prisma.ts         # Database client
│   ├── logger.ts         # Logging utility
│   └── ...
├── prisma/               # Database schema and migrations
│   └── schema.prisma
├── public/               # Static assets
└── __tests__/            # Test files
```

## Key Features Explained

### AI Styling Assistant (`/ai-stylist`)

The AI Stylist uses a hybrid approach:

- **Primary**: Google Gemini API for natural language processing
- **Fallback**: Local intelligent system that works without external APIs
- Detects user preferences (anime, streetwear, formal, etc.)
- Generates complete outfits from your product catalog
- Saves conversations and preferences to the database

### Color Analysis (Colorimetry)

- Upload a selfie to get AI-powered skin tone analysis
- Discover your seasonal color palette (Spring, Summer, Autumn, Winter)
- Get personalized color recommendations
- Results stored for future outfit suggestions

### Virtual Closet

- Add items from your purchases or manual entry
- Track outfit combinations
- Get suggestions based on closet items
- Monitor wear frequency

### Bitcoin Payments

- Integrated with Coinbase Commerce
- QR code generation for easy payment
- Automatic order confirmation upon payment
- Webhook handling for payment status

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Deploy on Vercel**

   - Import your repository at [vercel.com](https://vercel.com)
   - Add environment variables
   - Deploy!

3. **Set up database**
   - Create a Vercel Postgres database
   - Run migrations: `npx prisma db push`
   - Seed data: `npm run prisma:seed`

### Environment Variables on Production

Make sure to set all required environment variables in your Vercel project settings.

## Admin Access

Default admin credentials (change after first login):

- Email: `admin@unix.com`
- Password: `admin123`

Admin features:

- Product management (CRUD)
- Order management
- User management
- Analytics dashboard
- Inventory control

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Santiago** - [@santy8ap](https://github.com/santy8ap)

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and database
- Google Gemini for AI capabilities
- All open-source contributors

## Contact

For questions or support, reach out via:

- Email: santi@unix.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/red-estampacion/issues)

---

**Built with pride using Next.js and AI**
