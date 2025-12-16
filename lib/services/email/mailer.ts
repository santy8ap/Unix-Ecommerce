import nodemailer from 'nodemailer'
import type { OrderConfirmationData } from './templates'
import { logger } from '@/lib/services/logger'

// Configurar transporter de Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

// Test de conexión
export async function testEmailConnection() {
    try {
        await transporter.verify()
        logger.success(' Email service connected successfully', { context: 'EMAIL' })
        return true
    } catch (error) {
        logger.error(' Email service connection failed', error, { context: 'EMAIL' })
        return false
    }
}

/**
 * Función genérica para enviar emails
 */
export interface EmailOptions {
    to: string
    subject: string
    html: string
    from?: string
}

export async function sendEmail(options: EmailOptions) {
    try {
        const result = await transporter.sendMail({
            from: options.from || process.env.SMTP_FROM || 'noreply@redestampacion.com',
            to: options.to,
            subject: options.subject,
            html: options.html,
        })

        logger.info(' Email enviado a:', { context: 'EMAIL', metadata: { to: options.to } })
        return result
    } catch (error) {
        logger.error(' Error enviando email', error, { context: 'EMAIL', metadata: { to: options.to } })
        throw error
    }
}

export async function sendOrderConfirmation(orderData: OrderConfirmationData) {
    try {
        const { orderConfirmationTemplate } = await import('./templates')
        const templateHtml = orderConfirmationTemplate(orderData)

        const result = await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@redestampacion.com',
            to: orderData.userEmail,
            subject: `Orden Confirmada - ${orderData.orderId}`,
            html: templateHtml,
        })

        logger.success(' Orden confirmada enviada', {
            context: 'EMAIL',
            metadata: { email: orderData.userEmail, orderId: orderData.orderId }
        })
        return result
    } catch (error) {
        logger.error(' Error enviando confirmación de orden', error, {
            context: 'EMAIL',
            metadata: { orderId: orderData.orderId }
        })
        throw error
    }
}

interface Order {
    id: string
    total: number
    status: string
    createdAt: Date
    user: {
        name: string | null
        email: string | null
    }
    items: Array<{
        quantity: number
        product: {
            name: string
        }
    }>
}

export async function sendDailyOrdersSummary(
    orders: Order[],
    adminEmail: string
) {
    try {
        if (!orders.length) {
            logger.info('ℹ️  No hay órdenes para enviar resumen', { context: 'EMAIL' })
            return
        }

        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
        const itemsList = orders.map(order =>
            `<li>Orden ${order.id}: $${order.total.toFixed(2)} - ${order.user.name || order.user.email}</li>`
        ).join('')

        const html = `
            <h2>Resumen Diario de Órdenes</h2>
            <p><strong>Total de órdenes:</strong> ${orders.length}</p>
            <p><strong>Ingresos totales:</strong> $${totalRevenue.toFixed(2)}</p>
            <h3>Detalle:</h3>
            <ul>${itemsList}</ul>
        `

        const result = await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@redestampacion.com',
            to: adminEmail,
            subject: `📊 Resumen Diario - ${orders.length} órdenes`,
            html,
        })

        logger.success('✅ Resumen diario de órdenes enviado', {
            context: 'EMAIL',
            metadata: { orderCount: orders.length }
        })
        return result
    } catch (error) {
        logger.error('❌ Error enviando resumen diario', error, { context: 'EMAIL' })
        throw error
    }
}

export async function sendWelcomeEmail(email: string, name: string) {
    try {
        const { welcomeEmailTemplate } = await import('./templates')
        const html = welcomeEmailTemplate(name)

        const result = await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@redestampacion.com',
            to: email,
            subject: '¡Bienvenido a Red Estampación!',
            html,
        })

        logger.success('✅ Email de bienvenida enviado', {
            context: 'EMAIL',
            metadata: { email }
        })
        return result
    } catch (error) {
        logger.error('❌ Error enviando email de bienvenida', error, {
            context: 'EMAIL',
            metadata: { email }
        })
        throw error
    }
}

export async function sendCustomEmail(
    to: string,
    subject: string,
    html: string
) {
    try {
        const result = await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@redestampacion.com',
            to,
            subject,
            html,
        })

        logger.success('✅ Email personalizado enviado', {
            context: 'EMAIL',
            metadata: { to }
        })
        return result
    } catch (error) {
        logger.error('❌ Error enviando email personalizado', error, {
            context: 'EMAIL',
            metadata: { to }
        })
        throw error
    }
}

export async function sendNewsletterConfirmation(email: string) {
    try {
        const result = await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@redestampacion.com',
            to: email,
            subject: '¡Suscripción Confirmada! + Regalo Sorpresa 🎁',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px; border-radius: 12px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 28px;">¡Bienvenido al Newsletter!</h1>
                </div>
                
                <div style="background: white; padding: 30px; margin-top: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Gracias por unirte a la comunidad de Red Estampación.
                    </p>
                    
                    <div style="margin: 30px 0; padding: 20px; background-color: #ecfdf5; border: 2px dashed #10b981; border-radius: 8px;">
                        <p style="margin: 0; font-size: 14px; color: #059669; font-weight: bold;">TU CÓDIGO DE DESCUENTO:</p>
                        <p style="margin: 10px 0 0; font-size: 32px; font-weight: 800; color: #059669; letter-spacing: 2px;">NEWS5</p>
                    </div>

                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/productos" 
                       style="display: inline-block; background-color: #10b981; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                        Usar mi Cupón Ahora
                    </a>
                </div>
            </div>
            `
        })
        logger.success('✅ Newsletter confirmation sent', {
            context: 'EMAIL',
            metadata: { email }
        })
        return result
    } catch (error) {
        logger.error('❌ Error sending newsletter confirmation', error, {
            context: 'EMAIL',
            metadata: { email }
        })
        // No lanzamos error para no romper el flujo del usuario si falla el email
        return null
    }
}
