import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { Adapter } from "next-auth/adapters"

// 🔒 Validación de Seguridad
// Si no hay secret en producción, esto fallará intencionalmente.
// En dev, usamos un fallback para que puedas trabajar.
const secret = process.env.NEXTAUTH_SECRET || (
  process.env.NODE_ENV === 'development'
    ? "fallback_secret_for_development_do_not_use_in_prod"
    : undefined
)

if (!secret) {
  throw new Error('❌ NEXTAUTH_SECRET missing in production')
}

export const authOptions: NextAuthOptions = {
  // Aseguramos que el adaptador tenga el tipo correcto
  adapter: PrismaAdapter(prisma) as Adapter,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_secret",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],

  session: {
    strategy: "jwt", // Cambiado a JWT para compatibilidad con middleware
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Agregar info del usuario al token JWT en el primer login
      if (user) {
        token.id = user.id
        // @ts-ignore - role doesn't exist on base User type but exists in our schema
        token.role = user.role || 'USER'
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      return token
    },

    async session({ session, token }) {
      // Pasar info del token JWT a la sesión
      if (token && session?.user) {
        session.user.id = token.id as string
        // @ts-ignore
        session.user.role = token.role as string
      }
      return session
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },

  // 🛠️ Configuración crítica para estabilidad
  secret: secret,
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }