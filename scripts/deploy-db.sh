#!/bin/bash

# Script para ejecutar migraciones y seed en Vercel Postgres
# Este script debe ejecutarse localmente con la DATABASE_URL de producción

echo "🚀 Ejecutando migraciones en Vercel Postgres..."

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Ejecutar seed
echo "🌱 Ejecutando seed..."
npm run prisma:seed

echo "✅ ¡Migraciones y seed completados!"
