/**
 * 📧 Email Template Types
 * Definiciones de tipo para templates de email
 */

export interface OrderItem {
    name: string
    quantity: number
    price: number
    size: string
    color: string
}

export interface OrderConfirmationData {
    orderId: string
    userName: string
    userEmail: string
    items: OrderItem[]
    total: number
    shippingAddress: string
    paymentMethod: string
    orderDate: string
}

export const orderConfirmationTemplate = (orderData: OrderConfirmationData) => {
    const { orderId, userName, items, total, shippingAddress, paymentMethod, orderDate } = orderData

    const itemsHtml = items.map((item) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 16px 8px;">
        <div style="font-weight: 600; color: #1e293b;">${item.name}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
          ${item.size} | ${item.color}
        </div>
      </td>
      <td style="padding: 16px 8px; text-align: center; color: #64748b;">
        ${item.quantity}
      </td>
      <td style="padding: 16px 8px; text-align: right; font-weight: 600; color: #1e293b;">
        $${item.price.toFixed(2)}
      </td>
    </tr>
  `).join('')

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirmación de Orden - Red Estampación</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Red Estampación</h1>
      <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px;">Tu Estilo Potenciado Por IA</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 20px;">
      <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 24px;">¡Gracias por tu compra, ${userName}!</h2>
      <p style="margin: 0 0 24px 0; color: #64748b; line-height: 1.6;">
        Tu orden ha sido confirmada y está siendo procesada. Te notificaremos cuando sea enviada.
      </p>

      <!-- Order Details -->
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #64748b; font-size: 14px;">Número de Orden:</span>
          <span style="color: #1e293b; font-weight: 600; font-size: 14px;">${orderId}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #64748b; font-size: 14px;">Fecha:</span>
          <span style="color: #1e293b; font-size: 14px;">${orderDate}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #64748b; font-size: 14px;">Método de Pago:</span>
          <span style="color: #1e293b; font-size: 14px;">${paymentMethod}</span>
        </div>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="border-bottom: 2px solid #e2e8f0;">
            <th style="padding: 12px 8px; text-align: left; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Producto</th>
            <th style="padding: 12px 8px; text-align: center; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Cant.</th>
            <th style="padding: 12px 8px; text-align: right; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Precio</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 16px 8px; text-align: right; font-weight: 600; color: #1e293b;">Total:</td>
            <td style="padding: 16px 8px; text-align: right; font-weight: 700; color: #6366f1; font-size: 18px;">$${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <!-- Shipping Address -->
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px;">Dirección de Envío</h3>
        <p style="margin: 0; color: #64748b; line-height: 1.6;">${shippingAddress}</p>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.NEXTAUTH_URL}/mis-ordenes" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Ver Mi Orden
        </a>
      </div>

      <!-- Footer Message -->
      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">¿Necesitas ayuda?</p>
        <p style="margin: 0; color: #64748b; font-size: 12px;">
          Contáctanos en <a href="mailto:support@redestampacion.com" style="color: #6366f1; text-decoration: none;">support@redestampacion.com</a>
        </p>
      </div>
    </div>

    <!-- Email Footer -->
    <div style="background-color: #f8fafc; padding: 24px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px;">© ${new Date().getFullYear()} Red Estampación. Todos los derechos reservados.</p>
      <p style="margin: 0; color: #94a3b8; font-size: 12px;">
        Estás recibiendo este email porque realizaste una compra en nuestra tienda.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

export const welcomeEmailTemplate = (userName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bienvenido a Red Estampación</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">¡Bienvenido a Red Estampación!</h1>
    </div>

    <div style="padding: 40px 20px;">
      <p style="margin: 0 0 16px 0; color: #1e293b; font-size: 18px; font-weight: 600;">Hola ${userName},</p>
      <p style="margin: 0 0 24px 0; color: #64748b; line-height: 1.6;">
        Estamos emocionados de tenerte con nosotros. Descubre moda única creada con inteligencia artificial.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.NEXTAUTH_URL}/productos" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Explorar Productos
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`
