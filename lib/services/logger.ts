/**
 * 📝 Logger Utility
 * Sistema centralizado de logging que solo muestra logs en desarrollo
 * y registra errores/warnings en producción de forma segura
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success'

interface LogOptions {
    context?: string
    metadata?: Record<string, unknown>
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development'

    private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
        const timestamp = new Date().toISOString()
        const context = options?.context ? `[${options.context}]` : ''
        const emoji = this.getEmoji(level)

        return `${emoji} ${timestamp} ${context} ${message}`
    }

    private getEmoji(level: LogLevel): string {
        const emojis: Record<LogLevel, string> = {
            info: 'ℹ️',
            warn: '⚠️',
            error: '❌',
            debug: '🔍',
            success: '✅'
        }
        return emojis[level] || 'ℹ️'
    }

    /**
     * Log informativo - Solo en desarrollo
     */
    info(message: string, options?: LogOptions): void {
        if (this.isDevelopment) {
            console.log(this.formatMessage('info', message, options))
            if (options?.metadata) {
                console.log('Metadata:', options.metadata)
            }
        }
    }

    /**
     * Log de éxito - Solo en desarrollo
     */
    success(message: string, options?: LogOptions): void {
        if (this.isDevelopment) {
            console.log(this.formatMessage('success', message, options))
            if (options?.metadata) {
                console.log('Metadata:', options.metadata)
            }
        }
    }

    /**
     * Log de debug - Solo en desarrollo
     */
    debug(message: string, options?: LogOptions): void {
        if (this.isDevelopment) {
            console.debug(this.formatMessage('debug', message, options))
            if (options?.metadata) {
                console.debug('Metadata:', options.metadata)
            }
        }
    }

    /**
     * Warning - Siempre se muestra pero de forma segura
     */
    warn(message: string, options?: LogOptions): void {
        console.warn(this.formatMessage('warn', message, options))

        // En producción, aquí podrías enviar a un servicio de monitoreo
        if (!this.isDevelopment && options?.metadata) {
            this.sendToMonitoring('warn', message, options.metadata)
        }
    }

    /**
     * Error - Siempre se muestra
     */
    error(message: string, error?: Error | unknown, options?: LogOptions): void {
        console.error(this.formatMessage('error', message, options))

        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: this.isDevelopment ? error.stack : '[Stack trace hidden in production]'
            })
        } else if (error) {
            console.error('Error data:', this.isDevelopment ? error : '[Error data hidden in production]')
        }

        // En producción, enviar a servicio de monitoreo
        if (!this.isDevelopment) {
            this.sendToMonitoring('error', message, {
                error: error instanceof Error ? error.message : String(error),
                ...options?.metadata
            })
        }
    }

    /**
     * Enviar a servicio de monitoreo (placeholder para futura implementación)
     * Aquí podrías integrar con Sentry, LogRocket, etc.
     */
    private sendToMonitoring(level: string, message: string, metadata?: Record<string, unknown>): void {
        // TODO: Implementar integración con servicio de monitoreo
        // Ejemplos: Sentry, LogRocket, DataDog, etc.

        // Por ahora, solo registramos que se enviaría
        if (this.isDevelopment) {
            console.log(`[Monitoring] Would send ${level}:`, message, metadata)
        }
    }

    /**
     * Timer utility - Para medir performance
     */
    time(label: string): void {
        if (this.isDevelopment) {
            console.time(label)
        }
    }

    timeEnd(label: string): void {
        if (this.isDevelopment) {
            console.timeEnd(label)
        }
    }

    /**
     * Group utility - Para agrupar logs relacionados
     */
    group(label: string): void {
        if (this.isDevelopment) {
            console.group(label)
        }
    }

    groupEnd(): void {
        if (this.isDevelopment) {
            console.groupEnd()
        }
    }

    /**
     * Table utility - Para mostrar datos tabulares
     */
    table(data: unknown): void {
        if (this.isDevelopment) {
            console.table(data)
        }
    }
}

// Export singleton instance
export const logger = new Logger()

// Export class for testing
export { Logger }
