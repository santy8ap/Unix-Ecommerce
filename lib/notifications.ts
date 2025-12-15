/**
 * Notifications Service
 * Sistema de almacenamiento y gestión de notificaciones del usuario
 */

export interface Notification {
    id: string
    type: 'order' | 'payment' | 'ai' | 'system' | 'promotion'
    title: string
    message: string
    link?: string
    read: boolean
    createdAt: Date
}

const STORAGE_KEY = 'user_notifications'

class NotificationService {
    private notifications: Notification[] = []

    constructor() {
        if (typeof window !== 'undefined') {
            this.loadNotifications()
        }
    }

    private loadNotifications() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                this.notifications = JSON.parse(stored).map((n: any) => ({
                    ...n,
                    createdAt: new Date(n.createdAt)
                }))
            }
        } catch (error) {
            console.error('Error loading notifications:', error)
        }
    }

    private saveNotifications() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications))
        } catch (error) {
            console.error('Error saving notifications:', error)
        }
    }

    addNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) {
        const newNotification: Notification = {
            ...notification,
            id: `notif-${Date.now()}-${Math.random()}`,
            read: false,
            createdAt: new Date(),
        }

        this.notifications.unshift(newNotification)

        // Keep only last 50 notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50)
        }

        this.saveNotifications()
        return newNotification
    }

    getNotifications(unreadOnly = false): Notification[] {
        if (unreadOnly) {
            return this.notifications.filter(n => !n.read)
        }
        return this.notifications
    }

    markAsRead(id: string) {
        const notification = this.notifications.find(n => n.id === id)
        if (notification) {
            notification.read = true
            this.saveNotifications()
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true)
        this.saveNotifications()
    }

    deleteNotification(id: string) {
        this.notifications = this.notifications.filter(n => n.id !== id)
        this.saveNotifications()
    }

    clearAll() {
        this.notifications = []
        this.saveNotifications()
    }

    getUnreadCount(): number {
        return this.notifications.filter(n => !n.read).length
    }
}

export const notificationService = new NotificationService()

// Helper functions para agregar diferentes tipos de notificaciones
export function notifyOrder(orderId: string, status: string) {
    return notificationService.addNotification({
        type: 'order',
        title: 'Actualización de Orden',
        message: `Tu orden #${orderId.slice(0, 8)} está ${status}`,
        link: `/mis-ordenes?orderId=${orderId}`,
    })
}

export function notifyPayment(success: boolean, amount: number) {
    return notificationService.addNotification({
        type: 'payment',
        title: success ? 'Pago Exitoso' : 'Pago Fallido',
        message: success
            ? `Tu pago de $${amount} fue procesado exitosamente`
            : `Hubo un problema con tu pago de $${amount}`,
    })
}

export function notifyAIFeature(feature: string, result: string) {
    return notificationService.addNotification({
        type: 'ai',
        title: `${feature} Completado`,
        message: result,
        link: feature === 'Análisis de Colorimetría' ? '/closet' : '/outfits',
    })
}

export function notifyPromotion(title: string, message: string, link?: string) {
    return notificationService.addNotification({
        type: 'promotion',
        title,
        message,
        link,
    })
}
