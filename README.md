# 🎨 Red Estampación - E-Commerce Platform

> **Status**: ✅ **FULLY FUNCTIONAL** | Production Ready | All Features Integrated

Una plataforma de e-commerce moderna y completa para venta de ropa estampada, construida con Next.js 16, React 19, Tailwind CSS y tecnologías de punta.

---

## 🚀 Quick Start

### 1. Instalar y Ejecutar (5 minutos)

```bash
# Instalar dependencias
npm install

# Setup base de datos (primera vez)
npx prisma migrate deploy
npx prisma db seed

# Iniciar servidor
npm run dev

# Abre http://localhost:3000
```

### 2. Primeras Pruebas

- ✅ **Login**: Haz clic en "Iniciar sesión" → Google
- ✅ **Ver Productos**: Navega a /productos
- ✅ **Agregar al Carrito**: Click en producto → "Agregar al carrito"
- ✅ **Checkout**: Ir a carrito → Checkout → Completar formulario
- ✅ **Email**: Revisa tu inbox para confirmación de orden
- ✅ **Admin**: Login como admin en /admin/productos/nuevo

---

## 🎯 Características Principales

### 🛍️ Para Clientes
- ✅ **Catálogo Completo**: Búsqueda + filtros por categoría, color, tamaño
- ✅ **Carrito Persistente**: localStorage + cálculo automático
- ✅ **Checkout Validado**: Validaciones Yup en tiempo real
- ✅ **Historial de Órdenes**: Mis órdenes autenticadas
- ✅ **Wishlist**: Guardar favoritos
- ✅ **Google OAuth**: Login seguro con Google
- ✅ **Notificaciones**: Toast en todas las acciones
- ✅ **Multiidioma**: Español e Inglés (i18n)
- ✅ **Responsive**: 100% mobile-friendly

### 👨‍💼 Para Administradores
- ✅ **Panel Admin**: Dashboard completo
- ✅ **Crear Productos**: Formulario con Cloudinary upload
- ✅ **Gestión de Stock**: Actualizar inventario
- ✅ **Filtros Avanzados**: Búsqueda de productos
- ✅ **Validaciones**: Yup en tiempo real
- ✅ **Múltiples Imágenes**: Drag & drop + reorder

### 📧 Automatización
- ✅ **Email Confirmación**: Automático después de compra
- ✅ **Email Diario**: Resumen de órdenes (9:00 AM)
- ✅ **Cron Jobs**: Recordatorio de carrito (cada 6h)
- ✅ **Templates HTML**: Profesionales y responsivos

---


Ver `SETUP_GUIDE.md` para detalles completos.

## 🚀 Tecnologías Utilizadas

### Frontend
- **Next.js 16.0.3** - React framework moderno
- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4.0+** - Utility-first styling
- **Framer Motion 12.23.24** - Smooth animations
- **Lucide React 0.554.0** - Modern icons
- **React Hook Form 7.66.1** - Form management
- **Yup 1.4.0** - Schema validation

### Backend & Services
- **Next.js API Routes** - Serverless backend
- **Prisma 6.19.0** - ORM for database
- **PostgreSQL** - Database
- **NextAuth.js v4.24.7** - Authentication
- **Nodemailer 7.0.11** - Email service
- **Cloudinary 2.8.0** - Image hosting
- **node-cron 3.0.3** - Scheduled tasks

### Testing & Quality
- **Cypress** - E2E testing
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- PostgreSQL database
- Cloudinary account (para manejo de imágenes)
- Google OAuth credentials (para autenticación)

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <https://github.com/santy8ap/Red-Estampacion>
cd Red-Estampacion
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear `.env.local`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/red_estampacion"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@red-estampacion.com"
```

4. **Configurar base de datos**
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

5. **Ejecutar desarrollo**
```bash
npm run dev
```

Acceder a [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
Red-Estampacion/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   ├── admin/                    # Admin dashboard
│   ├── auth/                     # Authentication pages
│   ├── productos/                # Product listing & detail
│   ├── carrito/                  # Shopping cart
│   ├── checkout/                 # Checkout flow
│   ├── colecciones/              # Collections
│   └── mis-ordenes/              # User orders
├── components/                   # Reusable React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── ProductForm.tsx
│   └── ...
├── context/                      # React Context (Cart, Language)
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
│   ├── prisma.ts                # Prisma client
│   ├── validations/             # Yup schemas
│   └── email/                   # Email service
├── prisma/                       # Database schema & migrations
├── public/                       # Static assets
└── ...
```

## 🎯 Rutas Principales

### Cliente
- `/` - Página de inicio
- `/productos` - Catálogo de productos
- `/productos/[id]` - Detalle del producto
- `/carrito` - Carrito de compras
- `/checkout` - Proceso de compra
- `/colecciones` - Colecciones de productos
- `/mis-ordenes` - Historial de órdenes
- `/auth/signin` - Iniciar sesión

### Administrador
- `/admin` - Dashboard principal
- `/admin/productos/nuevo` - Crear nuevo producto
- `/admin/productos/[id]` - Editar producto

## 👤 Cuentas de Prueba

**Administrador:**
- Email: admin@red-estampacion.com
- Contraseña: Generada automáticamente (ver base de datos)

**Cliente Regular:**
- Usar Google OAuth para autenticarse

## 🔐 Seguridad

- ✅ Autenticación con NextAuth.js
- ✅ Validación de datos en frontend y backend
- ✅ Protección de rutas por roles
- ✅ Variables de entorno protegidas
- ✅ HTTPS en producción recomendado
- ✅ CSRF protection

## 📊 Base de Datos

### Modelos principales
- `User` - Usuarios del sistema
- `Product` - Productos del catálogo
- `Order` - Órdenes de compra
- `OrderItem` - Items de órdenes
- `Collection` - Colecciones de productos

Ver `prisma/schema.prisma` para detalles completos.

## 🧪 Testing

```bash
# Tests unitarios
npm test

# E2E tests con Cypress
npm run cypress
npm run cypress:open  # interfaz visual
```

## 📈 Performance

- Optimización de imágenes con Cloudinary
- Code splitting automático
- Server-side rendering donde sea necesario
- Client-side rendering para interactividad
- Caché de datos inteligente

## 🌐 Internacionalización

Soporta Español e Inglés. La configuración se encuentra en:
- `i18n/messages/es.json` - Traducciones en español
- `i18n/messages/en.json` - Traducciones en inglés

## 📧 Notificaciones por Email

El sistema envía emails para:
- Confirmación de registro
- Confirmación de ordenes
- Notificaciones de envío
- Recordatorios de carrito abandonado

## 🚢 Despliegue

### En Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### En otros servidores
```bash
npm run build
npm start
```

## 📝 Changelog

### v1.0.0 (Reciente)
- ✨ Nueva página de signin profesional
- ✨ Panel de admin mejorado con tabla interactiva
- ✨ Formulario de productos con mejor UX
- ✨ Sección de características mejorada
- 🐛 Correcciones de validación en formularios
- 🚀 Mejor manejo de errores

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo MIT. Ver `LICENSE` para más detalles.

## 👥 Soporte

Para soporte, contactar a:
- Email: support@red-estampacion.com
- Issues: GitHub Issues
- Documentación: `/docs`

---

**Hecho con ❤️ para Red Estampación**
