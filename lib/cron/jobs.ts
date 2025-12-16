import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/services/email/mailer'
import cron from 'node-cron'
import { logger } from '@/lib/services/logger'

// ============================================
// 📊 Cron Job: Reporte Diario de Órdenes
// ============================================

const dailyOrderReportJob = cron.schedule(
  '0 9 * * *', // Todos los días a las 9:00 AM
  async () => {
    try {
      logger.info('🔄 [CRON] Iniciando reporte diario de órdenes...', { context: 'CRON' })

      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)

      const endOfYesterday = new Date(yesterday)
      endOfYesterday.setHours(23, 59, 59, 999)

      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: yesterday,
            lte: endOfYesterday,
          },
        },
        include: {
          user: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      if (orders.length > 0) {
        const totalRevenue = orders
          .filter((o) => o.paymentStatus === 'completed' || o.paymentMethod === 'bitcoin')
          .reduce((sum, order) => sum + order.total, 0)

        await sendEmail({
          to: process.env.ADMIN_EMAIL || 'admin@redestampacion.com',
          subject: `📊 Reporte Diario - ${orders.length} órdenes`,
          html: `
            <h2>Reporte de Órdenes del ${yesterday.toLocaleDateString()}</h2>
            <p><strong>Total de órdenes:</strong> ${orders.length}</p>
            <p><strong>Ingresos totales:</strong> $${totalRevenue.toFixed(2)}</p>
          `,
        })
        logger.success(`✅ [CRON] Reporte enviado: ${orders.length} órdenes`, {
          context: 'CRON',
          metadata: { orderCount: orders.length, revenue: totalRevenue }
        })
      } else {
        logger.info('ℹ️  [CRON] No hay órdenes para reportar', { context: 'CRON' })
      }
    } catch (error) {
      logger.error('❌ [CRON] Error en reporte diario de órdenes', error, { context: 'CRON' })
    }
  },
  { scheduled: false }
)

logger.success('✅ Cron job "Reporte diario de órdenes" activado (9:00 AM)', { context: 'CRON_SETUP' })

// ============================================
// 🛒 Cron Job: Recordatorio de Carrito Abandonado
// ============================================

const abandonedCartJob = cron.schedule(
  '0 */6 * * *', // Cada 6 horas
  async () => {
    try {
      logger.info('🔄 [CRON] Verificando carritos abandonados...', { context: 'CRON' })

      const twentyFourHoursAgo = new Date()
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

      const abandonedOrders = await prisma.order.findMany({
        where: {
          status: 'PENDING',
          paymentStatus: 'pending',
          createdAt: {
            gte: twentyFourHoursAgo,
          },
        },
        include: {
          user: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      for (const order of abandonedOrders) {
        try {
          await sendEmail({
            to: order.user.email!,
            subject: '🛒 Tienes productos esperándote',
            html: `
              <h2>Hola ${order.user.name},</h2>
              <p>Notamos que dejaste algunos productos en tu carrito.</p>
              <p>¿Quieres completar tu orden? <a href="${process.env.NEXTAUTH_URL}/checkout">Continuar compra</a></p>
            `,
          })
          logger.info(`📧 [CRON] Recordatorio enviado a ${order.user.email}`, { context: 'CRON' })
        } catch (emailError) {
          logger.warn('Fallo al enviar recordatorio', { context: 'CRON', metadata: { userId: order.userId } })
        }
      }

      logger.success(`✅ [CRON] ${abandonedOrders.length} recordatorios de carrito enviados`, {
        context: 'CRON',
        metadata: { count: abandonedOrders.length }
      })
    } catch (error) {
      logger.error('❌ [CRON] Error en recordatorio de carritos', error, { context: 'CRON' })
    }
  },
  { scheduled: false }
)

logger.success('✅ Cron job "Recordatorio de carrito" activado (cada 6 horas)', { context: 'CRON_SETUP' })

// ============================================
// 🧹 Cron Job: Limpieza de Datos
// ============================================

const dataCleanupJob = cron.schedule(
  '0 3 * * *', // Todos los días a las 3:00 AM
  async () => {
    try {
      logger.info('🔄 [CRON] Iniciando limpieza de datos...', { context: 'CRON' })
      // Aquí puedes agregar lógica de limpieza específica
      logger.success('✅ [CRON] Limpieza de datos completada', { context: 'CRON' })
    } catch (error) {
      logger.error('❌ [CRON] Error en limpieza de datos', error, { context: 'CRON' })
    }
  },
  { scheduled: false }
)

logger.success('✅ Cron job "Limpieza de datos" activado (3:00 AM)', { context: 'CRON_SETUP' })

// ============================================
// 🚀 Inicialización de Cron Jobs
// ============================================

export async function initCronJobs() {
  logger.info('\n🚀 Inicializando Cron Jobs...', { context: 'CRON_SETUP' })

  try {
    dailyOrderReportJob.start()
    abandonedCartJob.start()
    dataCleanupJob.start()

    logger.success('✅ Todos los cron jobs han sido activados\n', { context: 'CRON_SETUP' })
  } catch (error) {
    logger.error('❌ Error inicializando cron jobs', error, { context: 'CRON_SETUP' })
  }
}

// ============================================
// 🛑 Detener Cron Jobs
// ============================================

export function stopCronJobs() {
  logger.info('🛑 Deteniendo todos los cron jobs...', { context: 'CRON_SETUP' })

  const jobs = { dailyOrderReportJob, abandonedCartJob, dataCleanupJob }
  for (const [name, job] of Object.entries(jobs)) {
    job.stop()
    logger.info(`✅ Cron job "${name}" detenido`, { context: 'CRON_SETUP' })
  }
}
